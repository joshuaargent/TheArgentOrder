import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  MessageFlags,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;
const SUCCESS_GREEN = 0x10b981;
const WARNING_YELLOW = 0xf59e0b;
const ERROR_RED = 0xef4444;

export default {
  data: new SlashCommandBuilder()
    .setName("pod")
    .setDescription("Pod management and accountability")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("View your pod information")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("members")
        .setDescription("List pod members")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("wins")
        .setDescription("Share a win with your pod")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("What did you accomplish?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Leave your current pod")
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for leaving (optional)")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a member from your pod (captains only)")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to remove")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for removal")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("meeting")
        .setDescription("Schedule or view pod meetings")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Action to take")
            .setRequired(true)
            .addChoices(
              { name: "📅 View Upcoming", value: "view" },
              { name: "➕ Schedule", value: "schedule" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("datetime")
            .setDescription("Meeting date/time (ISO format)")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("notes")
            .setDescription("Meeting notes/agenda")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("attendance")
        .setDescription("Mark attendance for a meeting")
        .addIntegerOption((option) =>
          option
            .setName("meeting_id")
            .setDescription("Meeting ID")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("attended")
            .setDescription("Did you attend?")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "info":
        await showPodInfo(interaction);
        break;
      case "members":
        await showPodMembers(interaction);
        break;
      case "wins":
        await shareWin(interaction);
        break;
      case "leave":
        await leavePod(interaction);
        break;
      case "remove":
        await removeMember(interaction);
        break;
      case "meeting":
        await manageMeeting(interaction);
        break;
      case "attendance":
        await markAttendance(interaction);
        break;
    }
  },
};

// Helper: Get user's Discord account and pod membership
async function getUserPodContext(interaction: ChatInputCommandInteraction) {
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    return { discordAccount: null, membership: null, pod: null };
  }

  const { data: membership } = await supabase
    .from("pod_members")
    .select("id, pod_id, pod_role, pods(*)")
    .eq("user_id", discordAccount.user_id)
    .is("left_at", null)  // Only active memberships
    .single();

  if (!membership) {
    return { discordAccount, membership: null, pod: null };
  }

  return { discordAccount, membership, pod: membership.pods as any };
}

// Helper: Check if user is captain
async function isUserCaptain(podId: string, userId: string): Promise<boolean> {
  const { data: pod } = await supabase
    .from("pods")
    .select("captain_id")
    .eq("id", podId)
    .single();

  return pod?.captain_id === userId;
}

async function showPodInfo(interaction: ChatInputCommandInteraction) {
  const { discordAccount, membership, pod } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account first with **/link**, or use the OAuth invite.",
    });
    return;
  }

  if (!membership || !pod) {
    const embed = new EmbedBuilder()
      .setTitle("🔥 NO POD ASSIGNED")
      .setDescription("You're not in a pod yet.\n\nContact your Captain or Officer. Pods are mandatory.")
      .setColor(ERROR_RED);
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  // Get upcoming meetings
  const { data: meetings } = await supabase
    .from("pod_meetings")
    .select("*")
    .eq("pod_id", pod.id)
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at")
    .limit(3);

  // Get active member count
  const { count: memberCount } = await supabase
    .from("pod_members")
    .select("*", { count: "exact", head: true })
    .eq("pod_id", pod.id)
    .is("left_at", null);

  // Get your role
  const roleEmoji = membership.pod_role === 'captain' ? '👑' : 
                    membership.pod_role === 'mentor' ? '🎓' : '⚔️';

  const embed = new EmbedBuilder()
    .setTitle(`🔥 YOUR POD: ${pod.name}`)
    .setDescription(pod.description || "Accountability unit")
    .addFields(
      { name: "Your Role", value: `${roleEmoji} ${membership.pod_role}`, inline: true },
      { name: "Members", value: `${memberCount || 0} brothers`, inline: true },
      { name: "Status", value: "Active", inline: true }
    )
    .setColor(ARGENT_SILVER)
    .setFooter({ text: "Brotherhood. Accountability. Execution." });

  if (meetings && meetings.length > 0) {
    const meetingList = meetings.map(m => {
      const date = new Date(m.scheduled_at).toLocaleString();
      return `📅 ${date}`;
    }).join('\n');
    embed.addFields({
      name: "Upcoming Meetings",
      value: meetingList,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function showPodMembers(interaction: ChatInputCommandInteraction) {
  const { discordAccount, membership, pod } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with /link, or use the OAuth invite.",
    });
    return;
  }

  if (!membership || !pod) {
    await interaction.editReply({
      content: "You are not in a pod yet. Contact your Captain or Officer.",
    });
    return;
  }

  // Get active members with profiles
  const { data: members } = await supabase
    .from("pod_members")
    .select(`
      user_id,
      pod_role,
      joined_at,
      profiles(display_name, avatar_url)
    `)
    .eq("pod_id", membership.pod_id)
    .is("left_at", null);  // Only active members

  const embed = new EmbedBuilder()
    .setTitle(`🔥 ${pod.name} - Members`)
    .setDescription(`${members?.length || 0} active brothers`)
    .setColor(ARGENT_SILVER);

  if (members && members.length > 0) {
    const memberList = members.map((member: any) => {
      const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
      const name = profile?.display_name || "Unknown Brother";
      const roleEmoji = member.pod_role === 'captain' ? '👑' : 
                       member.pod_role === 'mentor' ? '🎓' : '⚔️';
      const joined = new Date(member.joined_at).toLocaleDateString();
      return `${roleEmoji} **${name}** - Joined ${joined}`;
    }).join('\n');

    embed.setDescription(memberList);
  }

  await interaction.editReply({ embeds: [embed] });
}

async function shareWin(interaction: ChatInputCommandInteraction) {
  const message = interaction.options.getString("message", true);
  const { discordAccount } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with /link, or use the OAuth invite.",
    });
    return;
  }

  // Create formation event with source
  const { error } = await supabase.from("formation_events").insert({
    user_id: discordAccount.user_id,
    pillar: "brotherhood",
    points: 5,
    reason: "Shared a win with pod",
    metadata: { message },
  });

  if (error) {
    console.error("Failed to log win:", error);
    await interaction.editReply({
      content: "⚠️ Failed to share win. Please try again.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("🏆 WIN SHARED")
    .setDescription(message)
    .setFooter({ text: "Execute. Build. Lead. Together." })
    .setColor(SUCCESS_GREEN);

  await interaction.editReply({ embeds: [embed] });
}

async function leavePod(interaction: ChatInputCommandInteraction) {
  const reason = interaction.options.getString("reason");
  const { discordAccount, membership, pod } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with /link, or use the OAuth invite.",
    });
    return;
  }

  if (!membership || !pod) {
    await interaction.editReply({
      content: "You are not in a pod yet.",
    });
    return;
  }

  // Check if captain is trying to leave
  const isCaptain = await isUserCaptain(pod.id, discordAccount.user_id);
  if (isCaptain) {
    // Check if there are other members
    const { count: memberCount } = await supabase
      .from("pod_members")
      .select("*", { count: "exact", head: true })
      .eq("pod_id", pod.id)
      .is("left_at", null);

    if ((memberCount || 0) > 1) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Cannot Leave as Captain")
        .setDescription("You are the captain of this pod. Please transfer leadership to another member before leaving, or contact an Officer.")
        .setColor(WARNING_YELLOW);
      await interaction.editReply({ embeds: [embed] });
      return;
    }
  }

  // Call the database function for graceful departure
  const { error } = await supabase.rpc("handle_member_graceful_departure", {
    p_user_id: discordAccount.user_id,
    p_pod_id: pod.id,
    p_departure_type: "voluntary",
    p_reason: reason || "User chose to leave",
  });

  if (error) {
    console.error("Failed to leave pod:", error);
    await interaction.editReply({
      content: "⚠️ Failed to leave pod. Please contact an Officer.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("👋 Left Pod")
    .setDescription(`You have gracefully left **${pod.name}**.\n\nIf you'd like to join another pod, contact an Officer.`)
    .setColor(ARGENT_SILVER);
  await interaction.editReply({ embeds: [embed] });
}

async function removeMember(interaction: ChatInputCommandInteraction) {
  const targetUser = interaction.options.getUser("member", true);
  const reason = interaction.options.getString("reason", true);
  const { discordAccount, membership, pod } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with /link, or use the OAuth invite.",
    });
    return;
  }

  if (!membership || !pod) {
    await interaction.editReply({
      content: "You are not in a pod.",
    });
    return;
  }

  // Check if user is captain
  const isCaptain = await isUserCaptain(pod.id, discordAccount.user_id);
  if (!isCaptain) {
    await interaction.editReply({
      content: "Only the Captain can remove members from the pod.",
    });
    return;
  }

  // Get target's Discord account
  const { data: targetAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", targetUser.id)
    .single();

  if (!targetAccount) {
    await interaction.editReply({
      content: `Could not find ${targetUser.username}'s linked account.`,
    });
    return;
  }

  // Can't remove yourself
  if (targetAccount.user_id === discordAccount.user_id) {
    await interaction.editReply({
      content: "You cannot remove yourself. Use /pod leave instead.",
    });
    return;
  }

  // Call database function
  const { error } = await supabase.rpc("handle_member_graceful_departure", {
    p_user_id: targetAccount.user_id,
    p_pod_id: pod.id,
    p_departure_type: "removed",
    p_reason: reason,
  });

  if (error) {
    console.error("Failed to remove member:", error);
    await interaction.editReply({
      content: "⚠️ Failed to remove member. Please try again.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("👢 Member Removed")
    .setDescription(`${targetUser.username} has been removed from the pod.\n\nReason: ${reason}`)
    .setColor(ERROR_RED);
  await interaction.editReply({ embeds: [embed] });
}

async function manageMeeting(interaction: ChatInputCommandInteraction) {
  const action = interaction.options.getString("action", true);
  const datetime = interaction.options.getString("datetime");
  const notes = interaction.options.getString("notes");
  const { discordAccount, membership, pod } = await getUserPodContext(interaction);

  if (!discordAccount || !membership || !pod) {
    await interaction.editReply({
      content: "You are not in a pod.",
    });
    return;
  }

  // Only captains can schedule meetings
  const isCaptain = await isUserCaptain(pod.id, discordAccount.user_id);

  if (action === "view") {
    const { data: meetings } = await supabase
      .from("pod_meetings")
      .select("*")
      .eq("pod_id", pod.id)
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at")
      .limit(5);

    if (!meetings || meetings.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle(`📅 ${pod.name} - Meetings`)
        .setDescription("No upcoming meetings scheduled.")
        .setColor(ARGENT_SILVER);
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const meetingList = meetings.map((m: any, i: number) => {
      const date = new Date(m.scheduled_at).toLocaleString();
      const notes = m.notes || "No notes";
      return `**${i + 1}.** ${date}\n   📝 ${notes}\n   🆔 ID: ${m.id}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`📅 ${pod.name} - Upcoming Meetings`)
      .setDescription(meetingList)
      .setColor(ARGENT_SILVER);
    await interaction.editReply({ embeds: [embed] });
    return;
  }

  if (action === "schedule") {
    if (!isCaptain) {
      await interaction.editReply({
        content: "Only the Captain can schedule meetings.",
      });
      return;
    }

    if (!datetime) {
      await interaction.editReply({
        content: "Please provide a date/time for the meeting.",
      });
      return;
    }

    const { error } = await supabase.from("pod_meetings").insert({
      pod_id: pod.id,
      scheduled_at: datetime,
      notes: notes || null,
    });

    if (error) {
      console.error("Failed to schedule meeting:", error);
      await interaction.editReply({
        content: "⚠️ Failed to schedule meeting. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("✅ Meeting Scheduled")
      .setDescription(`Meeting scheduled for ${new Date(datetime).toLocaleString()}\n\n${notes ? `Notes: ${notes}` : ""}`)
      .setColor(SUCCESS_GREEN);
    await interaction.editReply({ embeds: [embed] });
  }
}

async function markAttendance(interaction: ChatInputCommandInteraction) {
  const meetingId = interaction.options.getInteger("meeting_id", true);
  const attended = interaction.options.getBoolean("attended", true);
  const { discordAccount } = await getUserPodContext(interaction);

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with /link, or use the OAuth invite.",
    });
    return;
  }

  // Check if meeting exists
  const { data: meeting } = await supabase
    .from("pod_meetings")
    .select("id, pod_id")
    .eq("id", meetingId)
    .single();

  if (!meeting) {
    await interaction.editReply({
      content: "Meeting not found.",
    });
    return;
  }

  // Insert or update attendance
  const { error } = await supabase.from("pod_attendance").upsert({
    meeting_id: meetingId,
    user_id: discordAccount.user_id,
    attended,
  }, {
    onConflict: "meeting_id,user_id",
  });

  if (error) {
    console.error("Failed to mark attendance:", error);
    await interaction.editReply({
      content: "⚠️ Failed to mark attendance. Please try again.",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(attended ? "✅ Attendance Marked" : "ℹ️ Attendance Updated")
    .setDescription(attended ? "You're marked as attending! 💪" : "Your attendance has been updated.")
    .setColor(attended ? SUCCESS_GREEN : ARGENT_SILVER);
  await interaction.editReply({ embeds: [embed] });
}
