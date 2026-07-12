import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { supabase } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("sync")
    .setDescription("Sync your Discord role with your portal rank (Admin: sync all members)")
    .addBooleanOption((option) =>
      option
        .setName("all")
        .setDescription("Sync all members (Admin only)")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const syncAll = interaction.options.getBoolean("all") || false;
    const isAdmin = interaction.memberPermissions?.has("Administrator") || false;

    if (syncAll && !isAdmin) {
      await interaction.reply({
        content: "⚠️ Only administrators can sync all members.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (syncAll) {
      await syncAllMembers(interaction);
    } else {
      await syncMember(interaction);
    }
  },
};

async function syncMember(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const member = interaction.member as GuildMember;
  
  if (!member) {
    await interaction.editReply({
      content: "❌ Could not identify your member status.",
    });
    return;
  }

  try {
    // First check if user is linked via discord_accounts
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", member.user.id)
      .single();

    let rankName = "Initiate";

    if (discordAccount) {
      // User is linked - get their rank from user_ranks
      const { data: userRank } = await supabase
        .from("user_ranks")
        .select("ranks(name)")
        .eq("user_id", discordAccount.user_id)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .single();

      rankName = (userRank as any)?.ranks?.name || "Initiate";
    } else {
      // Check profiles table for discord_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("ranks(name)")
        .eq("discord_id", member.user.id)
        .single();

      if ((profile as any)?.ranks) {
        rankName = (profile as any).ranks.name;
      } else {
        const embed = new EmbedBuilder()
          .setTitle("⚠️ Account Not Linked")
          .setDescription("Your Discord account is not connected to The Argent Order portal.\n\nUse **/link** to generate a connection code, then enter it on the portal.")
          .setColor(0xf59e0b)
          .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
        return;
      }
    }

    // Update Discord role
    await updateMemberRole(member, rankName);

    const embed = new EmbedBuilder()
      .setTitle("⚔️ Role Synced")
      .setDescription(`Your Discord role has been updated to **${rankName}**`)
      .setColor(0xa1a1aa)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Sync error:", error);
    await interaction.editReply({
      content: "⚠️ Failed to sync role. Please try again or contact an officer.",
    });
  }
}

async function syncAllMembers(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const guild = interaction.guild;
  
  if (!guild) {
    await interaction.editReply({
      content: "⚠️ This command can only be used in a server.",
    });
    return;
  }

  // Get all linked users via discord_accounts table
  const { data: linkedUsers } = await supabase
    .from("discord_accounts")
    .select("discord_id, user_id");

  // Also get users with discord_id directly on profiles
  const { data: profileUsers } = await supabase
    .from("profiles")
    .select("discord_id")
    .not("discord_id", "is", null);

  // Build a map of discord_id to user_id
  const discordToUser = new Map<string, string>();
  
  if (linkedUsers) {
    for (const user of linkedUsers) {
      discordToUser.set(user.discord_id, user.user_id);
    }
  }

  // Get ranks for all users
  const userIds = Array.from(discordToUser.values());
  let rankMap = new Map<string, string>();

  if (userIds.length > 0) {
    const { data: userRanks } = await supabase
      .from("user_ranks")
      .select("user_id, ranks(name)")
      .in("user_id", userIds);

    if (userRanks) {
      for (const ur of userRanks as any[]) {
        rankMap.set(ur.user_id, ur.ranks?.name || "Initiate");
      }
    }
  }

  let synced = 0;
  let failed = 0;
  let notInServer = 0;

  for (const [discordId, userId] of discordToUser) {
    const discordMember = guild.members.cache.find(
      (m) => m.user.id === discordId
    );

    if (!discordMember) {
      notInServer++;
      continue;
    }

    try {
      const rankName = rankMap.get(userId) || "Initiate";
      await updateMemberRole(discordMember, rankName);
      synced++;
    } catch (error) {
      failed++;
    }
  }

  const embed = new EmbedBuilder()
    .setTitle("⚔️ Bulk Sync Complete")
    .addFields(
      { name: "✅ Synced", value: synced.toString(), inline: true },
      { name: "⚠️ Failed", value: failed.toString(), inline: true },
      { name: "👤 Not in Server", value: notInServer.toString(), inline: true }
    )
    .setColor(synced > 0 ? 0xa1a1aa : 0xef4444)
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

async function updateMemberRole(member: GuildMember, rankName: string) {
  // Map rank names to Discord role names
  const rankRoleMap: Record<string, string> = {
    visitor: "Visitor",
    initiate: "Initiate",
    brother: "Brother",
    veteran: "Veteran",
    captain: "Captain",
    officer: "Officer",
    mentor: "Mentor",
    steward: "Steward",
  };

  const targetRoleName = rankRoleMap[rankName?.toLowerCase()] || "Initiate";

  // Get the guild
  const guild = member.guild;
  
  // Find the target role
  const targetRole = guild.roles.cache.find(
    (r) => r.name.toLowerCase() === targetRoleName.toLowerCase()
  );

  if (!targetRole) {
    console.warn(`Role "${targetRoleName}" not found in guild`);
    return;
  }

  // Remove all existing rank roles
  const rankRoles = ["Visitor", "Initiate", "Brother", "Veteran", "Captain", "Officer", "Mentor", "Steward"];
  
  for (const roleName of rankRoles) {
    const role = guild.roles.cache.find((r) => r.name === roleName);
    if (role && member.roles.cache.has(role.id)) {
      await member.roles.remove(role);
    }
  }

  // Add the new rank role
  await member.roles.add(targetRole);
}
