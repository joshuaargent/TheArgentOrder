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
    .setName("link")
    .setDescription("Generate a link code to connect your Discord account to The Argent Order portal"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Check if already linked
    const { data: existingLink } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (existingLink) {
      const embed = new EmbedBuilder()
        .setTitle("🔗 Account Already Linked")
        .setDescription("Your Discord account is already connected to The Argent Order portal.\n\nUse **/sync** to update your Discord role.")
        .setColor(ARGENT_SILVER);
      
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Generate a unique link code
    const linkCode = generateLinkCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store the link code
    const { error } = await supabase.from("discord_link_codes").insert({
      discord_id: interaction.user.id,
      code: linkCode,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error("Failed to create link code:", error);
      await interaction.editReply({
        content: "⚠️ Failed to generate link code. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🔗 Link Your Account")
      .setDescription(
        `Use this code on The Argent Order portal to connect your Discord account:\n\n` +
        `**Code: \`${linkCode}\`**\n\n` +
        `This code expires in 10 minutes.`
      )
      .addFields(
        { name: "Expires", value: expiresAt.toLocaleTimeString(), inline: true }
      )
      .setColor(ARGENT_SILVER)
      .setTimestamp()
      .setFooter({ text: "After linking, use /sync to get your rank role." });

    await interaction.editReply({ embeds: [embed] });
  },
};

function generateLinkCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
