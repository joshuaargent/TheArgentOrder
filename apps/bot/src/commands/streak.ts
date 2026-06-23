import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("streak")
    .setDescription("Check your current formation streak"),

  async execute(interaction: ChatInputCommandInteraction) {
    // TODO: Fetch from Supabase
    const streakData = {
      overall: 0,
      faith: 0,
      discipline: 0,
      brotherhood: 0,
      building: 0,
      truth: 0,
      longestOverall: 0,
    };

    const embed = {
      title: "🔥 Formation Streaks",
      color: 0xff_99_00,
      fields: [
        {
          name: "Overall Streak",
          value: `**${streakData.overall}** days`,
          inline: true,
        },
        {
          name: "Longest Ever",
          value: `**${streakData.longestOverall}** days`,
          inline: true,
        },
        { name: "\u200B", value: "\u200B" },
        { name: "Faith", value: `${streakData.faith} 🔥`, inline: true },
        { name: "Discipline", value: `${streakData.discipline} 🔥`, inline: true },
        { name: "Brotherhood", value: `${streakData.brotherhood} 🔥`, inline: true },
        { name: "Building", value: `${streakData.building} 🔥`, inline: true },
        { name: "Truth", value: `${streakData.truth} 🔥`, inline: true },
      ],
      footer: {
        text: "Keep building your streaks every day!",
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
