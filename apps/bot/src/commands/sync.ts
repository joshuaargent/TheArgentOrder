import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
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
        content: "❌ Only administrators can sync all members.",
        ephemeral: true,
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
  await interaction.deferReply({ ephemeral: true });

  const member = interaction.member as GuildMember;
  
  if (!member) {
    await interaction.editReply({
      content: "❌ Could not identify your member status.",
    });
    return;
  }

  try {
    // Get user's rank from database
    const { data: userRank } = await supabase
      .from("user_ranks")
      .select("ranks(name)")
      .eq("discord_id", member.user.id)
      .order("assigned_at", { ascending: false })
      .limit(1)
      .single();

    // If not linked via discord_id, try via profiles
    if (!userRank) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("rank_id, ranks(name)")
        .eq("discord_id", member.user.id)
        .single();

      if (profile?.ranks) {
        await updateMemberRole(member, profile.ranks.name);
        await interaction.editReply({
          content: `✅ Synced your role to **${profile.ranks.name}**`,
        });
        return;
      }

      await interaction.editReply({
        content: "❌ Your account is not linked. Use /link first.",
      });
      return;
    }

    // Update Discord role
    await updateMemberRole(member, userRank.ranks.name);

    const embed = new EmbedBuilder()
      .setTitle("✅ Role Synced")
      .setDescription(`Your Discord role has been updated to **${userRank.ranks.name}**`)
      .setColor(0x00_ff_88)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("Sync error:", error);
    await interaction.editReply({
      content: "❌ Failed to sync role. Please try again.",
    });
  }
}

async function syncAllMembers(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const guild = interaction.guild;
  
  if (!guild) {
    await interaction.editReply({
      content: "❌ This command can only be used in a server.",
    });
    return;
  }

  // Get all linked users
  const { data: linkedUsers } = await supabase
    .from("profiles")
    .select("discord_id, ranks(name)")
    .not("discord_id", "is", null);

  let synced = 0;
  let failed = 0;
  let notLinked = 0;

  for (const user of linkedUsers || []) {
    const discordMember = guild.members.cache.find(
      (m) => m.user.id === user.discord_id
    );

    if (!discordMember) {
      notLinked++;
      continue;
    }

    try {
      await updateMemberRole(discordMember, user.ranks?.name || "Initiate");
      synced++;
    } catch (error) {
      failed++;
    }
  }

  const embed = new EmbedBuilder()
    .setTitle("🔄 Bulk Sync Complete")
    .addFields(
      { name: "✅ Synced", value: synced.toString(), inline: true },
      { name: "❌ Failed", value: failed.toString(), inline: true },
      { name: "👤 Not in Server", value: notLinked.toString(), inline: true }
    )
    .setColor(synced > 0 ? 0x00_ff_88 : 0xff_00_00)
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
