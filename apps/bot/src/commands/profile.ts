import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your formation profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to view").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const user = interaction.options.getUser("user") || interaction.user;

    // TODO: Fetch from Supabase
    // For now, show a placeholder
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}'s Profile`)
      .setThumbnail(user.displayAvatarURL())
      .addFields(
        { name: "Rank", value: "Initiate", inline: true },
        { name: "Formation Score", value: "0", inline: true },
        { name: "Current Streak", value: "0 days", inline: true }
      )
      .setColor(0x0099ff)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
