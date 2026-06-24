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
    .setName("mass")
    .setDescription("Log Mass attendance"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      await interaction.editReply({
        content: "Use **/link** to connect your Discord account first.",
      });
      return;
    }

    // Check if already logged today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: existing } = await supabase
      .from("formation_events")
      .select("id")
      .eq("user_id", discordAccount.user_id)
      .eq("reason", "Mass Attendance")
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString())
      .single();

    if (existing) {
      await interaction.editReply({
        content: "You've already logged Mass today! Come back tomorrow.",
      });
      return;
    }

    // Calculate points (30 for Mass)
    const points = 30;

    // Insert formation event
    const { error } = await supabase.from("formation_events").insert({
      user_id: discordAccount.user_id,
      pillar: "faith",
      points: points,
      reason: "Mass Attendance",
      metadata: { type: "mass" },
    });

    if (error) {
      console.error("Failed to log mass:", error);
      await interaction.editReply({
        content: "Failed to log Mass. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("💒 Mass Logged")
      .setDescription("Thanks for attending Mass!")
      .addFields(
        { name: "Points Earned", value: `**+${points}**`, inline: true }
      )
      .setColor(ARGENT_SILVER)
      .setTimestamp();
      .setFooter({ text: "The Eucharist strengthens your formation." })

    await interaction.editReply({ embeds: [embed] });
  },
};
