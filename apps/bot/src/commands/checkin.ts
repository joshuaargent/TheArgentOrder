import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("checkin")
    .setDescription("Daily check-in to track your formation habits")
    .addBooleanOption((option) =>
      option
        .setName("prayer")
        .setDescription("Did you pray today?")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("workout")
        .setDescription("Did you workout today?")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("deep_work")
        .setDescription("Did you do deep work today?")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("note")
        .setDescription("Any notes about today?")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const prayed = interaction.options.getBoolean("prayer", true);
    const workedOut = interaction.options.getBoolean("workout", true);
    const deepWork = interaction.options.getBoolean("deep_work") || false;
    const note = interaction.options.getString("note");

    let points = 0;
    const activities: string[] = [];

    if (prayed) {
      points += 10;
      activities.push("Prayer (+10)");
    }
    if (workedOut) {
      points += 10;
      activities.push("Workout (+10)");
    }
    if (deepWork) {
      points += 15;
      activities.push("Deep Work (+15)");
    }

    const embed = {
      title: "✅ Daily Check-In Complete",
      color: 0x00_99_ff,
      fields: [
        { name: "Activities Completed", value: activities.join("\n") || "None" },
        { name: "Points Earned", value: `**+${points}**`, inline: true },
        {
          name: "Streak",
          value: "🔥 0 days",
          inline: true,
        },
      ],
      footer: {
        text: note ? `Note: ${note}` : "Keep building your formation!",
      },
    };

    await interaction.reply({ embeds: [embed] });
  },
};
