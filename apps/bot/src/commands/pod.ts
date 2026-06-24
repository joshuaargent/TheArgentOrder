import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;

export default {
  data: new SlashCommandBuilder()
    .setName("pod")
    .setDescription("Pod management and accountability")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("View your pod information")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("members")
        .setDescription("List pod members")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("wins")
        .setDescription("Share a win with your pod")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("What did you accomplish?")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "info":
        await showPodInfo(interaction);
        break;
      case "members":
        await showPodMembers(interaction);
        break;
      case "wins":
        await shareWin(interaction);
        break;
    }
  },
};

async function showPodInfo(interaction: ChatInputCommandInteraction) {
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Use **/link** to connect your Discord account first",
    });
    return;
  }

  const { data: membership } = await supabase
    .from("pod_members")
    .select("pod_id, pods(*)")
    .eq("user_id", discordAccount.user_id)
    .single();

  if (!membership) {
    const embed = new EmbedBuilder()
      .setTitle("👥 No Pod")
      .setDescription("You are not in a pod yet. Contact your captain or officer to be assigned to a pod.")
      .setColor(ARGENT_SILVER);
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  const pod = membership.pods;
  const { data: meetings } = await supabase
    .from("pod_meetings")
    .select("*")
    .eq("pod_id", pod.id)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .limit(3);

  const embed = new EmbedBuilder()
    .setTitle(`👥 ${pod.name}`)
    .setDescription(pod.description || "No description")
    .addFields(
      { name: "Status", value: "Active", inline: true },
      { name: "Captain", value: "Contact officer", inline: true }
    )
    .setColor(ARGENT_SILVER);

  if (meetings && meetings.length > 0) {
    const nextMeeting = meetings[0];
    embed.addFields({
      name: "Next Meeting",
      value: new Date(nextMeeting.scheduled_at).toLocaleString(),
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function showPodMembers(interaction: ChatInputCommandInteraction) {
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Use **/link** to connect your Discord account first",
    });
    return;
  }

  const { data: membership } = await supabase
    .from("pod_members")
    .select("pod_id")
    .eq("user_id", discordAccount.user_id)
    .single();

  if (!membership) {
    await interaction.editReply({
      content: "You are not in a pod yet.",
    });
    return;
  }

  const { data: members } = await supabase
    .from("pod_members")
    .select("user_id, joined_at")
    .eq("pod_id", membership.pod_id);

  const embed = new EmbedBuilder()
    .setTitle("👥 Pod Members")
    .setDescription(`${members?.length || 0} members`)
    .setColor(ARGENT_SILVER);

  if (members && members.length > 0) {
    for (const member of members.slice(0, 10)) {
      embed.addFields({
        name: `Brother`,
        value: `Joined: ${new Date(member.joined_at).toLocaleDateString()}`,
        inline: true,
      });
    }
  }

  await interaction.editReply({ embeds: [embed] });
}

async function shareWin(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message", true);

  // Get Discord account
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Use **/link** to connect your Discord account first",
    });
    return;
  }

  // Create formation event
  await supabase.from("formation_events").insert({
    user_id: discordAccount.user_id,
    pillar: "brotherhood",
    points: 5,
    reason: "Shared a win with pod",
    metadata: { message },
  });

  const embed = new EmbedBuilder()
    .setTitle("🏆 Win Shared!")
    .setDescription(message)
    .setFooter({ text: "Keep building!" })
    .setColor(ARGENT_SILVER);

  await interaction.editReply({ embeds: [embed] });
}
