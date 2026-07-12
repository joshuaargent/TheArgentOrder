import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;
const EVENT_BLUE = 0x3b82f6;

const EVENT_TYPES = [
  { value: "rosary", label: "Rosary", icon: "🌹" },
  { value: "bible_study", label: "Bible Study", icon: "📖" },
  { value: "pod_meeting", label: "Pod Meeting", icon: "👥" },
  { value: "workshop", label: "Workshop", icon: "🛠️" },
  { value: "builder_session", label: "Builder Session", icon: "🏗️" },
  { value: "qa", label: "Q&A", icon: "❓" },
  { value: "guest_speaker", label: "Guest Speaker", icon: "🎙️" },
  { value: "retreat", label: "Retreat", icon: "⛪" },
];

export default {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Manage formation events")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new event")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Event title")
            .setRequired(true)
            .setMaxLength(100)
        )
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Event type")
            .setRequired(true)
            .addChoices(...EVENT_TYPES.map((t) => ({ name: `${t.icon} ${t.label}`, value: t.value })))
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Event description")
            .setRequired(false)
            .setMaxLength(500)
        )
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("Date and time (YYYY-MM-DD HH:MM)")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration in minutes (default: 60)")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("location")
            .setDescription("Location or meeting link")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("join")
        .setDescription("Join an event")
        .addStringOption((option) =>
          option
            .setName("event_id")
            .setDescription("Event ID")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Leave an event")
        .addStringOption((option) =>
          option
            .setName("event_id")
            .setDescription("Event ID")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List upcoming events")
        .addIntegerOption((option) =>
          option
            .setName("limit")
            .setDescription("Number of events to show (default: 10)")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("attendance")
        .setDescription("Check attendance for an event")
        .addStringOption((option) =>
          option
            .setName("event_id")
            .setDescription("Event ID")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        await this.handleCreate(interaction);
        break;
      case "join":
        await this.handleJoin(interaction);
        break;
      case "leave":
        await this.handleLeave(interaction);
        break;
      case "list":
        await this.handleList(interaction);
        break;
      case "attendance":
        await this.handleAttendance(interaction);
        break;
    }
  },

  async handleCreate(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const title = interaction.options.getString("title", true);
    const eventType = interaction.options.getString("type", true);
    const description = interaction.options.getString("description") || "";
    const dateStr = interaction.options.getString("date", true);
    const duration = interaction.options.getInteger("duration") || 60;
    const location = interaction.options.getString("location") || "TBD";

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id, username")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use OAuth invite to connect your Discord account first.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Check if user has permission (leader roles)
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const hasPermission = member?.roles.cache.some((role) =>
      ["Officer", "Mentor", "Steward", "Leader"].includes(role.name)
    );

    if (!hasPermission) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Permission Denied")
        .setDescription("Only leaders (Officer, Mentor, Steward) can create events.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Parse date
    const eventDate = new Date(dateStr);
    if (isNaN(eventDate.getTime())) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Invalid Date")
        .setDescription("Please use format: `YYYY-MM-DD HH:MM` (e.g., 2024-03-15 19:00)")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Create event (using formation_events table)
    const { data: event, error } = await supabase
      .from("formation_events")
      .insert({
        user_id: discordAccount.user_id,
        pillar: eventType,
        reason: title,
        points: 0,
        metadata: {
          type: "event",
          event_type: eventType,
          description: description,
          event_date: eventDate.toISOString(),
          duration_minutes: duration,
          location: location,
          creator: interaction.user.username,
          status: "scheduled",
        },
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create event:", error);
      await interaction.editReply({
        content: "⚠️ Failed to create event. Please try again.",
      });
      return;
    }

    const eventTypeInfo = EVENT_TYPES.find((t) => t.value === eventType);
    const embed = new EmbedBuilder()
      .setTitle(`${eventTypeInfo?.icon || "📅"} Event Created`)
      .setDescription(`**${title}**`)
      .addFields(
        { name: "Type", value: eventTypeInfo?.label || eventType, inline: true },
        { name: "Date", value: eventDate.toLocaleString(), inline: true },
        { name: "Duration", value: `${duration} min`, inline: true },
        { name: "Location", value: location, inline: true },
        { name: "ID", value: `\`${event.id.substring(0, 8)}\``, inline: true }
      )
      .setColor(EVENT_BLUE)
      .setTimestamp()
      .setFooter({ text: `Created by ${interaction.user.username}` });

    if (description) {
      embed.addFields({ name: "Description", value: description });
    }

    await interaction.editReply({ embeds: [embed] });

    // Announce in events channel
    const eventsChannelId = process.env.EVENTS_CHANNEL_ID;
    if (eventsChannelId) {
      try {
        const channel = await interaction.client.channels.fetch(eventsChannelId);
        if (channel?.isTextBased()) {
          const announceEmbed = new EmbedBuilder()
            .setTitle(`${eventTypeInfo?.icon || "📅"} New Event: ${title}`)
            .setDescription(description || "No description provided")
            .addFields(
              { name: "📆 Date", value: eventDate.toLocaleString(), inline: true },
              { name: "⏱️ Duration", value: `${duration} min`, inline: true },
              { name: "📍 Location", value: location, inline: true }
            )
            .addFields({
              name: "RSVP",
              value: `Use **/event join ${event.id.substring(0, 8)}** to join`,
            })
            .setColor(EVENT_BLUE)
            .setTimestamp();

          const message = await (channel as { send: Function }).send({ embeds: [announceEmbed] });
          await message.react("✅");
        }
      } catch (err) {
        console.error("Failed to announce event:", err);
      }
    }
  },

  async handleJoin(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const eventId = interaction.options.getString("event_id", true);

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id, username")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use OAuth invite to connect your Discord account first.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Find the event (try to find by partial ID match)
    const { data: events } = await supabase
      .from("formation_events")
      .select("id, metadata, created_at")
      .eq("metadata->>type", "event")
      .order("created_at", { ascending: false })
      .limit(10);

    const event = events?.find((e) => e.id.startsWith(eventId));

    if (!event) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Event Not Found")
        .setDescription(`No event found with ID starting with \`${eventId}\`.\nUse **/event list** to see upcoming events.`)
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const metadata = event.metadata || {};
    const attendees = metadata.attendees || [];

    if (attendees.includes(discordAccount.user_id)) {
      const embed = new EmbedBuilder()
        .setTitle("ℹ️ ALREADY JOINED")
        .setDescription("You're already registered for this event.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Add user to attendees
    attendees.push(discordAccount.user_id);

    const { error } = await supabase
      .from("formation_events")
      .update({ metadata: { ...metadata, attendees: attendees } })
      .eq("id", event.id);

    if (error) {
      console.error("Failed to join event:", error);
      await interaction.editReply({
        content: "⚠️ Failed to join event. Please try again.",
      });
      return;
    }

    const eventTypeInfo = EVENT_TYPES.find((t) => t.value === metadata.event_type);

    const embed = new EmbedBuilder()
      .setTitle("✅ REGISTERED!")
      .setDescription(`You're in for **${metadata.reason || "the event"}**`)
      .addFields(
        {
          name: "Event",
          value: `${eventTypeInfo?.icon || "📅"} ${metadata.event_type}`,
          inline: true,
        },
        {
          name: "Date",
          value: new Date(metadata.event_date).toLocaleString(),
          inline: true,
        },
        {
          name: "Attendees",
          value: `${attendees.length} registered`,
          inline: true,
        }
      )
      .setColor(0x10b981)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleLeave(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const eventId = interaction.options.getString("event_id", true);

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use OAuth invite to connect your Discord account first.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Find the event
    const { data: events } = await supabase
      .from("formation_events")
      .select("id, metadata")
      .eq("metadata->>type", "event")
      .order("created_at", { ascending: false })
      .limit(10);

    const event = events?.find((e) => e.id.startsWith(eventId));

    if (!event) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Event Not Found")
        .setDescription(`No event found with ID starting with \`${eventId}\`.`)
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const metadata = event.metadata || {};
    const attendees = metadata.attendees || [];
    const userIndex = attendees.indexOf(discordAccount.user_id);

    if (userIndex === -1) {
      const embed = new EmbedBuilder()
        .setTitle("ℹ️ Not REGISTERED")
        .setDescription("You weren't registered for this event.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Remove user from attendees
    attendees.splice(userIndex, 1);

    const { error } = await supabase
      .from("formation_events")
      .update({ metadata: { ...metadata, attendees: attendees } })
      .eq("id", event.id);

    if (error) {
      console.error("Failed to leave event:", error);
      await interaction.editReply({
        content: "⚠️ Failed to leave event. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("👋 EVENT LEFT")
      .setDescription(`You've been removed from **${metadata.reason || "the event"}**`)
      .addFields({
        name: "Attendees",
        value: `${attendees.length} remaining`,
        inline: true,
      })
      .setColor(ARGENT_SILVER)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleList(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const limit = interaction.options.getInteger("limit") ?? 10;

    // Get upcoming events
    const { data: events, error } = await supabase
      .from("formation_events")
      .select("id, reason, created_at, metadata")
      .eq("metadata->>type", "event")
      .eq("metadata->>status", "scheduled")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch events:", error);
      await interaction.editReply({
        content: "⚠️ Failed to fetch events. Please try again.",
      });
      return;
    }

    if (!events || events.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("📅 UPCOMING EVENTS")
        .setDescription("No events scheduled.\nLeaders can create events with **/event create**.")
        .setColor(EVENT_BLUE)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const eventList = events.map((event: any) => {
      const metadata = event.metadata || {};
      const eventTypeInfo = EVENT_TYPES.find((t) => t.value === metadata.event_type);
      const shortId = event.id.substring(0, 8);
      const eventDate = metadata.event_date ? new Date(metadata.event_date).toLocaleString() : "TBD";
      const attendeeCount = (metadata.attendees || []).length;

      return `**${eventTypeInfo?.icon || "📅"} ${event.reason}**\n` +
        `   └ ID: \`${shortId}\` • ${eventDate}\n` +
        `   └ ${attendeeCount} attending`;
    }).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle("📅 UPCOMING EVENTS")
      .setDescription(eventList)
      .addFields({
        name: "RSVP",
        value: "Use **/event join <id>** to register",
      })
      .setColor(EVENT_BLUE)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleAttendance(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const eventId = interaction.options.getString("event_id", true);

    // Check if user has permission
    const member = await interaction.guild?.members.fetch(interaction.user.id);
    const hasPermission = member?.roles.cache.some((role) =>
      ["Officer", "Mentor", "Steward", "Leader"].includes(role.name)
    );

    if (!hasPermission) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Permission Denied")
        .setDescription("Only leaders can view attendance.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Find the event
    const { data: events } = await supabase
      .from("formation_events")
      .select("id, reason, metadata")
      .eq("metadata->>type", "event")
      .order("created_at", { ascending: false })
      .limit(10);

    const event = events?.find((e) => e.id.startsWith(eventId));

    if (!event) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Event Not Found")
        .setDescription(`No event found with ID starting with \`${eventId}\`.`)
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const metadata = event.metadata || {};
    const attendees = metadata.attendees || [];

    // Get attendee details
    let attendeeList = "No one has registered yet.";
    if (attendees.length > 0) {
      const { data: discordAccounts } = await supabase
        .from("discord_accounts")
        .select("user_id, username")
        .in("user_id", attendees);

      attendeeList = discordAccounts?.map((a) => `• ${a.username}`).join("\n") || "Could not load attendees.";
    }

    const eventTypeInfo = EVENT_TYPES.find((t) => t.value === metadata.event_type);

    const embed = new EmbedBuilder()
      .setTitle(`${eventTypeInfo?.icon || "📅"} ${event.reason}`)
      .setDescription(`**Attendance: ${attendees.length} registered**\n\n${attendeeList}`)
      .addFields({
        name: "Event ID",
        value: `\`${event.id.substring(0, 8)}\``,
        inline: true,
      })
      .setColor(EVENT_BLUE)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
