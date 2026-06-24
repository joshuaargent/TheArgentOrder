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
    .setName("campaign")
    .setDescription("Manage your campaign participation")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List available campaigns")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join")
        .setDescription("Join a campaign")
        .addStringOption((option) =>
          option
            .setName("slug")
            .setDescription("Campaign slug")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("progress")
        .setDescription("View your campaign progress")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "list":
        await listCampaigns(interaction);
        break;
      case "join":
        await joinCampaign(interaction);
        break;
      case "progress":
        await showProgress(interaction);
        break;
    }
  },
};

async function listCampaigns(interaction: ChatInputCommandInteraction) {
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("active", true)
    .order("duration_days");

  if (!campaigns || campaigns.length === 0) {
    await interaction.editReply({
      content: "No active campaigns. Check back soon or contact an officer.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("🎯 ACTIVE CAMPAIGNS")
    .setDescription("**Pick one. Execute. Transform.**\n\nUse `/campaign join <slug>` to enroll.")
    .setColor(ARGENT_SILVER);

  for (const campaign of campaigns.slice(0, 10)) {
    embed.addFields({
      name: `⚔️ ${campaign.title}`,
      value: `${campaign.description}\n**Duration:** ${campaign.duration_days} days\n**Type:** ${campaign.campaign_type}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function joinCampaign(interaction: ChatInputCommandInteraction) {
  const slug = interaction.options.getString("slug", true);

  // Get Discord account
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account first with **/link**, or use the OAuth invite.",
    });
    return;
  }

  // Find campaign
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!campaign) {
    await interaction.editReply({
      content: `Campaign "${slug}" not found. Use **/campaign list** to see available campaigns.`,
    });
    return;
  }

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("campaign_enrollments")
    .select("id")
    .eq("user_id", discordAccount.user_id)
    .eq("campaign_id", campaign.id)
    .eq("status", "active")
    .single();

  if (existing) {
    await interaction.editReply({
      content: `You're already enrolled in **${campaign.title}**. Execute.`,
    });
    return;
  }

  // Create enrollment
  const { error } = await supabase.from("campaign_enrollments").insert({
    user_id: discordAccount.user_id,
    campaign_id: campaign.id,
    status: "active",
    started_at: new Date().toISOString(),
    completion_percent: 0,
  });

  if (error) {
    console.error("Failed to enroll:", error);
    await interaction.editReply({
      content: "Failed to join campaign. Please try again.",
    });
    return;
  }

  // Create formation event
  await supabase.from("formation_events").insert({
    user_id: discordAccount.user_id,
    pillar: "discipline",
    points: 25,
    reason: `Joined campaign: ${campaign.title}`,
  });

  const embed = new EmbedBuilder()
    .setTitle("⚔️ ENROLLED")
    .setDescription(`**${campaign.title}**\n\nThis is where the work begins.\n\nExecute. Complete. Transform.`)
    .addFields(
      { name: "Duration", value: `${campaign.duration_days} days`, inline: true },
      { name: "Type", value: campaign.campaign_type, inline: true },
      { name: "Action", value: "Use **/campaign progress** to track", inline: false }
    )
    .setColor(ARGENT_SILVER)
    .setFooter({ text: "Ship or die. No excuses." });

  await interaction.editReply({ embeds: [embed] });
}

async function showProgress(interaction: ChatInputCommandInteraction) {
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account first with **/link**, or use the OAuth invite.",
    });
    return;
  }

  const { data: enrollments } = await supabase
    .from("campaign_enrollments")
    .select("*, campaigns(*)")
    .eq("user_id", discordAccount.user_id)
    .eq("status", "active");

  if (!enrollments || enrollments.length === 0) {
    await interaction.editReply({
      content: "No active campaigns. Use **/campaign list** to enroll in one.\n\nPick a campaign. Execute. Transform.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("🎯 YOUR CAMPAIGNS")
    .setDescription("**Execute. Complete. Lead.**")
    .setColor(ARGENT_SILVER);

  for (const enrollment of enrollments) {
    const campaign = enrollment.campaigns;
    const progress = enrollment.completion_percent || 0;
    const bar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));
    embed.addFields({
      name: `⚔️ ${campaign.title}`,
      value: `${campaign.description}\n\`${bar}\` ${progress}%\n**Type:** ${campaign.campaign_type}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}
