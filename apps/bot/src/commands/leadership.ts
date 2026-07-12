import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;
const LEADERSHIP_GOLD = 0xd97706;
const HEALTH_GREEN = 0x10b981;
const HEALTH_YELLOW = 0xf59e0b;
const HEALTH_RED = 0xef4444;

export default {
  data: new SlashCommandBuilder()
    .setName("leadership")
    .setDescription("Leadership operations and insights")
    .addSubcommand((subcommand) =>
      subcommand.setName("leaderboard").setDescription("View formation leaderboard")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("review")
        .setDescription("Review a member's progress")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to review")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("promote")
        .setDescription("Recommend a member for promotion")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to recommend")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for recommendation")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("pod-health").setDescription("View pod health metrics")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("community-health").setDescription("View community health metrics")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Check permissions for leadership commands
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const hasPermission = member?.roles.cache.some((role) =>
      ["Officer", "Mentor", "Steward", "Leader", "Admin"].includes(role.name)
    );

    if (!hasPermission) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Permission Denied")
        .setDescription("This command is only available to leaders.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "leaderboard":
        await this.handleLeaderboard(interaction);
        break;
      case "review":
        await this.handleReview(interaction);
        break;
      case "promote":
        await this.handlePromote(interaction);
        break;
      case "pod-health":
        await this.handlePodHealth(interaction);
        break;
      case "community-health":
        await this.handleCommunityHealth(interaction);
        break;
    }
  },

  async handleLeaderboard(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Get top formation scores
    const { data: scores, error } = await supabase
      .from("formation_scores")
      .select("user_id, total_score, faith_score, discipline_score, building_score, community_score")
      .order("total_score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch leaderboard:", error);
      await interaction.editReply({
        content: "⚠️ Failed to fetch leaderboard.",
      });
      return;
    }

    if (!scores || scores.length === 0) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("🏆 Formation Leaderboard")
            .setDescription("No scores yet. Be the first!")
            .setColor(ARGENT_SILVER)
            .setTimestamp(),
        ],
      });
      return;
    }

    // Get usernames
    const userIds = scores.map((s) => s.user_id);
    const { data: discordAccounts } = await supabase
      .from("discord_accounts")
      .select("user_id, username")
      .in("user_id", userIds);

    const usernameMap = new Map(discordAccounts?.map((a) => [a.user_id, a.username]) || []);

    const leaderboard = scores.map((score, index) => {
      const username = usernameMap.get(score.user_id) || "Unknown";
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
      return `${medal} **${username}** - ${score.total_score} pts`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Formation Leaderboard")
      .setDescription(leaderboard)
      .addFields({
        name: "Categories",
        value: "✝️ Faith | ⚔️ Discipline | 🏗️ Building | 🤝 Community",
      })
      .setColor(LEADERSHIP_GOLD)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleReview(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const targetUser = interaction.options.getUser("member", true);

    // Get Discord account for target
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id, username")
      .eq("discord_id", targetUser.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Member Not Found")
        .setDescription(`${targetUser.username} hasn't linked their account.`)
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get formation scores
    const { data: scores } = await supabase
      .from("formation_scores")
      .select("*")
      .eq("user_id", discordAccount.user_id)
      .single();

    // Get formation level
    const { data: level } = await supabase
      .from("user_formation_levels")
      .select("formation_levels(name, level_order)")
      .eq("user_id", discordAccount.user_id)
      .single();

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("formation_events")
      .select("pillar, points, reason, created_at")
      .eq("user_id", discordAccount.user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get achievements
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select("achievements(name, icon)")
      .eq("user_id", discordAccount.user_id)
      .limit(5);

    const levelName = (level as any)?.formation_levels?.name || "Newcomer";
    const levelOrder = (level as any)?.formation_levels?.level_order || 0;

    const embed = new EmbedBuilder()
      .setTitle(`👤 ${targetUser.username}'s Profile`)
      .setDescription(`**Formation Level:** ${levelName} (${levelOrder})`)
      .addFields(
        {
          name: "✝️ Faith",
          value: String(scores?.faith_score || 0),
          inline: true,
        },
        {
          name: "⚔️ Discipline",
          value: String(scores?.discipline_score || 0),
          inline: true,
        },
        {
          name: "🏗️ Building",
          value: String(scores?.building_score || 0),
          inline: true,
        },
        {
          name: "🤝 Community",
          value: String(scores?.community_score || 0),
          inline: true,
        },
        {
          name: "📊 Total Score",
          value: `**${scores?.total_score || 0}**`,
          inline: true,
        }
      )
      .setColor(ARGENT_SILVER)
      .setTimestamp();

    if (recentActivity && recentActivity.length > 0) {
      const activityList = recentActivity
        .map((a) => `• ${a.pillar}: +${a.points} (${a.reason})`)
        .join("\n");
      embed.addFields({ name: "Recent Activity", value: activityList });
    }

    if (achievements && achievements.length > 0) {
      const achievementList = achievements
        .map((a: any) => `${a.achievements?.icon || "🏅"} ${a.achievements?.name}`)
        .join("\n");
      embed.addFields({ name: "Achievements", value: achievementList });
    }

    await interaction.editReply({ embeds: [embed] });
  },

  async handlePromote(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const targetUser = interaction.options.getUser("member", true);
    const reason = interaction.options.getString("reason", true);

    // Get Discord account for recommender
    const { data: recommenderAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!recommenderAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with /link, or use the OAuth invite.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get Discord account for candidate
    const { data: candidateAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", targetUser.id)
      .single();

    if (!candidateAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Member Not Found")
        .setDescription(`${targetUser.username} hasn't linked their account.`)
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get candidate's current rank
    const { data: currentRank } = await supabase
      .from("user_ranks")
      .select("ranks(name)")
      .eq("user_id", candidateAccount.user_id)
      .single();

    // Get all ranks for selection
    const { data: ranks } = await supabase
      .from("ranks")
      .select("id, name")
      .order("level", { ascending: false });

    const currentRankName = (currentRank as any)?.ranks?.name || "Newcomer";
    const nextRank = ranks?.find((r: any) => {
      // Find the rank after current
      const currentIndex = ranks.findIndex((rank: any) => rank.name === currentRankName);
      return ranks.findIndex((rank: any) => rank.name === r.name) === currentIndex + 1;
    });

    // Create promotion recommendation
    const { data: recommendation, error } = await supabase
      .from("promotion_recommendations")
      .insert({
        recommender_id: recommenderAccount.user_id,
        candidate_id: candidateAccount.user_id,
        current_rank: currentRankName,
        recommended_rank: nextRank?.name || "Unknown",
        reason: reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create recommendation:", error);
      await interaction.editReply({
        content: "⚠️ Failed to submit recommendation. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("✅ Promotion Recommended")
      .setDescription(`**Candidate:** ${targetUser.username}`)
      .addFields(
        { name: "Current Rank", value: currentRankName, inline: true },
        { name: "Recommended", value: nextRank?.name || "Unknown", inline: true },
        { name: "Reason", value: reason }
      )
      .setColor(HEALTH_GREEN)
      .setTimestamp()
      .setFooter({ text: `Submitted by ${interaction.user.username}` });

    await interaction.editReply({ embeds: [embed] });
  },

  async handlePodHealth(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with /link, or use the OAuth invite.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get user's pod
    const { data: podMembership } = await supabase
      .from("pod_members")
      .select("pod_id, pods(name)")
      .eq("user_id", discordAccount.user_id)
      .single();

    if (!podMembership) {
      const embed = new EmbedBuilder()
        .setTitle("👥 Pod Health")
        .setDescription("You're not in a pod yet.\nContact an officer to be assigned to one.")
        .setColor(ARGENT_SILVER)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const podId = podMembership.pod_id;
    const podName = (podMembership as any).pods?.name || "Unknown Pod";

    // Get pod members
    const { data: members } = await supabase
      .from("pod_members")
      .select("user_id")
      .eq("pod_id", podId);

    if (!members || members.length === 0) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`👥 ${podName} - Health Report`)
            .setDescription("No members found in pod.")
            .setColor(ARGENT_SILVER)
            .setTimestamp(),
        ],
      });
      return;
    }

    const memberIds = members.map((m) => m.user_id);

    // Get formation scores for pod members
    const { data: scores } = await supabase
      .from("formation_scores")
      .select("user_id, total_score")
      .in("user_id", memberIds);

    // Get recent activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: recentActivity } = await supabase
      .from("formation_events")
      .select("user_id, points, created_at")
      .in("user_id", memberIds)
      .gte("created_at", weekAgo.toISOString());

    // Calculate health metrics
    const activeMembers = new Set(recentActivity?.map((a) => a.user_id) || []);
    const avgScore = scores?.length
      ? Math.round(scores.reduce((sum, s) => sum + (s.total_score || 0), 0) / scores.length)
      : 0;
    const participationRate = scores?.length
      ? Math.round((activeMembers.size / scores.length) * 100)
      : 0;

    // Health status
    let healthColor = HEALTH_GREEN;
    let healthStatus = "Healthy";
    if (participationRate < 50) {
      healthColor = HEALTH_RED;
      healthStatus = "Needs Attention";
    } else if (participationRate < 75) {
      healthColor = HEALTH_YELLOW;
      healthStatus = "Moderate";
    }

    const embed = new EmbedBuilder()
      .setTitle(`👥 ${podName} - Health Report`)
      .setDescription(`**Status:** ${healthStatus}`)
      .addFields(
        {
          name: "👥 Members",
          value: String(scores?.length || 0),
          inline: true,
        },
        {
          name: "📊 Active This Week",
          value: String(activeMembers.size),
          inline: true,
        },
        {
          name: "📈 Avg. Score",
          value: String(avgScore),
          inline: true,
        },
        {
          name: "🎯 Participation",
          value: `${participationRate}%`,
          inline: true,
        }
      )
      .setColor(healthColor)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleCommunityHealth(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Get total members
    const { count: totalMembers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Get formation scores
    const { data: allScores } = await supabase
      .from("formation_scores")
      .select("total_score");

    // Get recent activity (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: recentActivity } = await supabase
      .from("formation_events")
      .select("user_id, points, pillar")
      .gte("created_at", weekAgo.toISOString());

    // Get active users this week
    const activeUsers = new Set(recentActivity?.map((a) => a.user_id) || []);

    // Calculate metrics
    const totalActiveUsers = activeUsers.size;
    const participationRate = totalMembers && totalMembers > 0
      ? Math.round((totalActiveUsers / totalMembers) * 100)
      : 0;

    const avgScore = allScores?.length
      ? Math.round(allScores.reduce((sum, s) => sum + (s.total_score || 0), 0) / allScores.length)
      : 0;

    // Pillar breakdown
    const pillarScores: Record<string, number> = {};
    recentActivity?.forEach((a) => {
      pillarScores[a.pillar] = (pillarScores[a.pillar] || 0) + a.points;
    });

    const pillarBreakdown = Object.entries(pillarScores)
      .map(([pillar, points]) => `${pillar}: ${points} pts`)
      .join("\n") || "No activity this week";

    // Health status
    let healthColor = HEALTH_GREEN;
    let healthStatus = "Thriving";
    if (participationRate < 30) {
      healthColor = HEALTH_RED;
      healthStatus = "Needs Attention";
    } else if (participationRate < 50) {
      healthColor = HEALTH_YELLOW;
      healthStatus = "Moderate";
    }

    const embed = new EmbedBuilder()
      .setTitle("🌐 Community Health Report")
      .setDescription(`**Status:** ${healthStatus}`)
      .addFields(
        {
          name: "👥 Total Members",
          value: String(totalMembers || 0),
          inline: true,
        },
        {
          name: "🔥 Active This Week",
          value: String(totalActiveUsers),
          inline: true,
        },
        {
          name: "📊 Avg. Score",
          value: String(avgScore),
          inline: true,
        },
        {
          name: "🎯 Participation",
          value: `${participationRate}%`,
          inline: true,
        }
      )
      .addFields({ name: "📈 Activity by Pillar", value: pillarBreakdown })
      .setColor(healthColor)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
