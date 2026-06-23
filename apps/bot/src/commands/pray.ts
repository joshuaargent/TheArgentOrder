import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

const PRAYER_TYPES: Record<string, { name: string; multiplier: number; icon: string }> = {
  morning: { name: "Morning Prayer", multiplier: 1.2, icon: "🛐" },
  general: { name: "General Prayer", multiplier: 1.0, icon: "🙏" },
  scripture: { name: "Scripture Prayer", multiplier: 1.5, icon: "📖" },
  rosary: { name: "Rosary", multiplier: 2.0, icon: "🌹" },
  mass: { name: "Mass", multiplier: 3.0, icon: "💒" },
  examen: { name: "Examen", multiplier: 1.5, icon: "💭" },
};

export default {
  data: new SlashCommandBuilder()
    .setName("pray")
    .setDescription("Log a prayer session for formation points")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of prayer")
        .setRequired(true)
        .addChoices(
          { name: "🛐 Morning Prayer", value: "morning" },
          { name: "🙏 General Prayer", value: "general" },
          { name: "📖 Scripture Prayer", value: "scripture" },
          { name: "🌹 Rosary", value: "rosary" },
          { name: "💒 Mass", value: "mass" },
          { name: "💭 Examen", value: "examen" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(180)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const prayerType = interaction.options.getString("type", true);
    const duration = interaction.options.getInteger("duration") || 15;

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

    // Calculate points based on duration and type
    const basePoints = Math.floor(duration / 5) * 5;
    const typeConfig = PRAYER_TYPES[prayerType] || PRAYER_TYPES.general;
    const points = Math.floor(basePoints * typeConfig.multiplier);

    // Log the formation event
    const { error } = await supabase.from("formation_events").insert({
      user_id: discordAccount.user_id,
      pillar: "faith",
      points: points,
      reason: `${typeConfig.name} (${duration} min)`,
      metadata: {
        prayer_type: prayerType,
        duration_minutes: duration,
      },
    });

    if (error) {
      console.error("Failed to log prayer:", error);
      await interaction.editReply({
        content: "Failed to log prayer. Please try again.",
      });
      return;
    }

    // Get updated score
    const { data: scores } = await supabase
      .from("formation_scores")
      .select("faith_score")
      .eq("user_id", discordAccount.user_id)
      .single();

    const embed = new EmbedBuilder()
      .setTitle("🙏 Prayer Logged")
      .setDescription(`${typeConfig.icon} **${typeConfig.name}**`)
      .addFields(
        { name: "Duration", value: `${duration} minutes`, inline: true },
        { name: "Points Earned", value: `**+${points}**`, inline: true },
        { name: "Faith Score", value: String(scores?.faith_score || 0), inline: true }
      )
      .setColor(0x0099ff)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
