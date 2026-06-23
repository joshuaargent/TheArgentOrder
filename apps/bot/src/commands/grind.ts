import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("grind")
    .setDescription("Log a deep work or building session")
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in hours (0.5 = 30 min)")
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
    const duration = interaction.options.getInteger("duration", true);
    const project = interaction.options.getString("project") || "General work";

    // Calculate points: 20 points per hour, bonus for 2+ hours
    let points = duration * 20;
    if (duration >= 4) points += 50; // Bonus for marathon sessions
    if (duration >= 8) points += 100; // Double bonus for full day

    const embed = {
      title: "🏋️ Grind Session Logged",
      color: 0x00_ff_88,
      description: project !== "General work" ? `Project: **${project}**` : undefined,
      fields: [
        {
          name: "Duration",
          value: `${duration} hour${duration > 1 ? "s" : ""}`,
          inline: true,
        },
        {
          name: "Points Earned",
          value: `**+${points}**`,
          inline: true,
        },
        {
          name: "Pillar",
          value: "Building / Discipline",
          inline: true,
        },
      ],
      footer: {
        text: "Keep building! A builder ships.",
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
