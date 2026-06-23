import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("grind")
    .setDescription("Log a deep work or building session")
    .addIntegerOption((option) =>
      option
        .setName("hours")
        .setDescription("Duration in hours")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(12)
    )
    .addStringOption((option) =>
      option
        .setName("project")
        .setDescription("What did you work on?")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const hours = interaction.options.getInteger("hours", true);
    const project = interaction.options.getString("project") || null;

    // Get Discord account for user
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      await interaction.editReply({
        content: "Please link your Discord account to The Argent Order portal first.",
      });
      return;
    }

    // Calculate points: 20 points per hour, bonus for 4+ hours
    let points = hours * 20;
    if (hours >= 4) points += 50; // Bonus for marathon sessions
    if (hours >= 8) points += 100; // Double bonus for full day

    // Insert formation event
    const { error } = await supabase.from("formation_events").insert({
      user_id: discordAccount.user_id,
      pillar: "building",
      points: points,
      reason: project ? `Deep work: ${project}` : `Deep work (${hours}h)`,
      metadata: {
        hours: hours,
        project: project,
      },
    });

    if (error) {
      console.error("Failed to log grind:", error);
      await interaction.editReply({
        content: "Failed to log grind session. Please try again.",
      });
      return;
    }

    // Get updated score
    const { data: scores } = await supabase
      .from("formation_scores")
      .select("building_score")
      .eq("user_id", discordAccount.user_id)
      .single();

    const embed = new EmbedBuilder()
      .setTitle("🏋️ Grind Session Logged")
      .setDescription(project ? `Project: **${project}**` : undefined)
      .addFields(
        { name: "Duration", value: `${hours} hour${hours > 1 ? "s" : ""}`, inline: true },
        { name: "Points Earned", value: `**+${points}**`, inline: true },
        { name: "Building Score", value: String(scores?.building_score || 0), inline: true }
      )
      .setColor(0x00_ff_88)
      .setTimestamp()
      .setFooter({ text: "Keep building! A builder ships." });

    await interaction.editReply({ embeds: [embed] });
  },
};
