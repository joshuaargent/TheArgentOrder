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
        content: "Link your account with **/link**, or use the OAuth invite.",
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
      source: "discord",
      metadata: {},
    });

    if (error) {
      console.error("Failed to log scripture:", error);
      await interaction.editReply({
        content: "Failed to log scripture. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("📖 SCRIPTURE LOGGED")
      .setDescription(`**${chapters}** chapter${chapters > 1 ? "s" : ""} read.\n\n*The Word strengthens your foundation.*`)
      .addFields(
        { name: "+⚡ Points", value: `**${points}**`, inline: true }
      )
      .setColor(ARGENT_SILVER)
      .setTimestamp()
      .setFooter({ text: "Execute. Build. Lead. In Christ." });

    await interaction.editReply({ embeds: [embed] });
  },
};
