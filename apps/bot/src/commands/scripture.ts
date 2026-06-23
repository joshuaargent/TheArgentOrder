import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("scripture")
    .setDescription("Log scripture reading")
    .addIntegerOption((option) =>
      option
        .setName("chapters")
        .setDescription("Number of chapters read")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(50)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const chapters = interaction.options.getInteger("chapters") || 1;

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

    // Calculate points: 10 per chapter, bonus for reading 3+
    let points = chapters * 10;
    if (chapters >= 3) points += 15;
    if (chapters >= 5) points += 25;

    // Insert formation event
    const { error } = await supabase.from("formation_events").insert({
      user_id: discordAccount.user_id,
      pillar: "faith",
      points: points,
      reason: `Scripture Reading (${chapters} chapter${chapters > 1 ? "s" : ""})`,
      metadata: { chapters },
    });

    if (error) {
      console.error("Failed to log scripture:", error);
      await interaction.editReply({
        content: "Failed to log scripture. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("📖 Scripture Logged")
      .setDescription(`Read **${chapters}** chapter${chapters > 1 ? "s" : ""} of scripture`)
      .addFields(
        { name: "Points Earned", value: `**+${points}**`, inline: true }
      )
      .setColor(0x3B82F6)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
