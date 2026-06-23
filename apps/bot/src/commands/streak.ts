import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

export default {
  data: new SlashCommandBuilder()
    .setName("streak")
    .setDescription("Check your current formation streak"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

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

    // Fetch all formation events from last 90 days
    const { data: events } = await supabase
      .from("formation_events")
      .select("pillar, created_at")
      .eq("user_id", discordAccount.user_id)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false });

    // Calculate streak by pillar
    const pillars = ["faith", "discipline", "brotherhood", "building", "truth"];
    const streaks: Record<string, number> = {};
    let longestOverall = 0;

    for (const pillar of pillars) {
      const pillarEvents = (events || [])
        .filter((e) => e.pillar === pillar)
        .map((e) => e.created_at.split("T")[0]);

      // Get unique days with activity
      const uniqueDays = [...new Set(pillarEvents)];
      uniqueDays.sort((a, b) => b.localeCompare(a)); // Sort descending

      // Calculate current streak
      let streak = 0;
      const today = new Date().toISOString().split("T")[0];
      let checkDate = new Date();

      for (let i = 0; i < 90; i++) {
        const dateStr = checkDate.toISOString().split("T")[0];
        if (uniqueDays.includes(dateStr)) {
          streak++;
        } else if (i > 0) {
          // Only break if we're past today (allow today to be missing)
          break;
        }
        checkDate.setDate(checkDate.getDate() - 1);
      }

      streaks[pillar] = streak;
      if (streak > longestOverall) longestOverall = streak;
    }

    // Overall streak
    const allDays = (events || [])
      .map((e) => e.created_at.split("T")[0]);
    const uniqueAllDays = [...new Set(allDays)].sort((a, b) => b.localeCompare(a));

    let overallStreak = 0;
    let checkDate = new Date();

    for (let i = 0; i < 90; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (uniqueAllDays.includes(dateStr)) {
        overallStreak++;
      } else if (i > 0) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    const PILLAR_ICONS: Record<string, string> = {
      faith: "✝️",
      discipline: "⚔️",
      brotherhood: "🤝",
      building: "🏗️",
      truth: "📖",
    };

    const embed = new EmbedBuilder()
      .setTitle("🔥 Formation Streaks")
      .addFields(
        { name: "Overall Streak", value: `**${overallStreak}** days`, inline: true },
        { name: "Longest Ever", value: `**${longestOverall}** days`, inline: true },
        { name: "\u200B", value: "\u200B" },
        { name: `${PILLAR_ICONS.faith} Faith`, value: `${streaks.faith} days 🔥`, inline: true },
        { name: `${PILLAR_ICONS.discipline} Discipline`, value: `${streaks.discipline} days 🔥`, inline: true },
        { name: `${PILLAR_ICONS.brotherhood} Brotherhood`, value: `${streaks.brotherhood} days 🔥`, inline: true },
        { name: `${PILLAR_ICONS.building} Building`, value: `${streaks.building} days 🔥`, inline: true },
        { name: `${PILLAR_ICONS.truth} Truth`, value: `${streaks.truth} days 🔥`, inline: true }
      )
      .setColor(0xff_99_00)
      .setTimestamp()
      .setFooter({ text: "Keep building your streaks every day!" });

    await interaction.editReply({ embeds: [embed] });
  },
};
