import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";

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
          { name: "💉 Examen", value: "examen" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration in minutes")
        .setRequired(false)
        .setMinValue(1)
        .setMaxValue(120)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const prayerType = interaction.options.getString("type", true);
    const duration = interaction.options.getInteger("duration") || 15;

    // Calculate points based on duration and type
    const basePoints = Math.floor(duration / 5) * 5;
    const typeMultipliers: Record<string, number> = {
      morning: 1.2,
      general: 1.0,
      scripture: 1.5,
      rosary: 2.0,
      mass: 3.0,
      examen: 1.5,
    };
    const points = Math.floor(basePoints * (typeMultipliers[prayerType] || 1));

    await interaction.reply({
      content: `🙏 **Prayer Logged**\n\nType: ${prayerType}\nDuration: ${duration} minutes\nPoints earned: **+${points}**\n\nKeep building your faith!`,
      ephemeral: true,
    });

    // TODO: Actually insert into Supabase
    // const { error } = await supabase.from('formation_events').insert({
    //   user_id: discordAccount.user_id,
    //   pillar: 'faith',
    //   points: points,
    //   reason: `Prayer: ${prayerType} (${duration} min)`,
    // });
  },
};
