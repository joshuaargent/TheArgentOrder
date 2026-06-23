import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

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
        content: "Please link your Discord account to The Argent Order portal first.",
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
      .setColor(0x3B82F6)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
