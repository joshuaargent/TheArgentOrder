import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

const ACTIVITY_POINTS: Record<string, number> = {
  prayer: 10,
  workout: 10,
  deep_work: 15,
  scripture: 5,
  fellowship: 10,
};

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
    .addBooleanOption((option) =>
      option
        .setName("scripture")
        .setDescription("Did you read scripture today?")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("note")
        .setDescription("Any notes about today?")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const prayed = interaction.options.getBoolean("prayer", true);
    const workedOut = interaction.options.getBoolean("workout", true);
    const deepWork = interaction.options.getBoolean("deep_work") || false;
    const scripture = interaction.options.getBoolean("scripture") || false;
    const note = interaction.options.getString("note");

    // Get Discord account for user
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

    let totalPoints = 0;
    const activities: { name: string; points: number; pillar: string }[] = [];

    // Log each activity
    if (prayed) {
      totalPoints += ACTIVITY_POINTS.prayer;
      activities.push({ name: "Prayer", points: ACTIVITY_POINTS.prayer, pillar: "faith" });
    }
    if (workedOut) {
      totalPoints += ACTIVITY_POINTS.workout;
      activities.push({ name: "Workout", points: ACTIVITY_POINTS.workout, pillar: "discipline" });
    }
    if (deepWork) {
      totalPoints += ACTIVITY_POINTS.deep_work;
      activities.push({ name: "Deep Work", points: ACTIVITY_POINTS.deep_work, pillar: "building" });
    }
    if (scripture) {
      totalPoints += ACTIVITY_POINTS.scripture;
      activities.push({ name: "Scripture", points: ACTIVITY_POINTS.scripture, pillar: "faith" });
    }

    // Insert formation events for each activity
    if (activities.length > 0) {
      const events = activities.map((a) => ({
        user_id: discordAccount.user_id,
        pillar: a.pillar,
        points: a.points,
        reason: `Daily check-in: ${a.name}`,
      }));

      await supabase.from("formation_events").insert(events);
    }

    // Calculate streak
    const { data: recentEvents } = await supabase
      .from("formation_events")
      .select("created_at")
      .eq("user_id", discordAccount.user_id)
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    let streak = 0;
    if (recentEvents && recentEvents.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const uniqueDays = new Set(
        recentEvents.map((e) => new Date(e.created_at).toISOString().split("T")[0])
      );
      streak = uniqueDays.size;
    }

    const activitiesText = activities.map((a) => `${a.name} (+${a.points})`).join("\n") || "None";

    const embed = new EmbedBuilder()
      .setTitle("✅ Daily Check-In Complete")
      .addFields(
        { name: "Activities", value: activitiesText, inline: true },
        { name: "Points Earned", value: `**+${totalPoints}**`, inline: true },
        { name: "🔥 Streak", value: `${streak} days`, inline: true }
      )
      .setColor(0x00_99_ff)
      .setTimestamp();

    if (note) {
      embed.setFooter({ text: `Note: ${note}` });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
