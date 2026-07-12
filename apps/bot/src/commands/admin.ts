import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;
const MOD_RED = 0xef4444;
const MOD_YELLOW = 0xf59e0b;
const MOD_GREEN = 0x10b981;

export default {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Administrative commands for moderation")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warn")
        .setDescription("Warn a member")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to warn")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for warning")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mute")
        .setDescription("Mute a member")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to mute")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for muting")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("Duration in minutes (default: 30)")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a member from the server")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to kick")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for kicking")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban a member from the server")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Member to ban")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for banning")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("delete_messages")
            .setDescription("Delete recent messages?")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("lockdown")
        .setDescription("Lock/unlock a channel")
        .addStringOption((option) =>
          option
            .setName("action")
            .setDescription("Lock or unlock")
            .setRequired(true)
            .addChoices(
              { name: "🔒 Lock", value: "lock" },
              { name: "🔓 Unlock", value: "unlock" }
            )
        )
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to lock/unlock (default: current)")
            .setRequired(false)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("Reason for lockdown")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("announce")
        .setDescription("Send an announcement")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Announcement title")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Announcement message")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel for announcement (default: announcements)")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("logs")
        .setDescription("View recent moderation actions")
        .addIntegerOption((option) =>
          option
            .setName("limit")
            .setDescription("Number of logs to show (default: 10)")
            .setRequired(false)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // Check for admin permissions
    const member = interaction.member as GuildMember;
    const isAdmin = member?.roles.cache.some((role) =>
      ["Admin", "Officer", "Moderator"].includes(role.name)
    );

    if (!isAdmin && !member?.permissions.has("Administrator")) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Permission Denied")
        .setDescription("This command is only available to administrators.")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "warn":
        await this.handleWarn(interaction);
        break;
      case "mute":
        await this.handleMute(interaction);
        break;
      case "kick":
        await this.handleKick(interaction);
        break;
      case "ban":
        await this.handleBan(interaction);
        break;
      case "lockdown":
        await this.handleLockdown(interaction);
        break;
      case "announce":
        await this.handleAnnounce(interaction);
        break;
      case "logs":
        await this.handleLogs(interaction);
        break;
    }
  },

  async handleWarn(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const targetUser = interaction.options.getUser("member", true);
    const reason = interaction.options.getString("reason", true);

    // Log moderation action
    await this.logModerationAction(interaction, "warn", targetUser, reason);

    const embed = new EmbedBuilder()
      .setTitle("⚠️ Warning Issued")
      .setDescription(`**Member:** ${targetUser}\n**Reason:** ${reason}`)
      .addFields({
        name: "Issued By",
        value: interaction.user.toString(),
      })
      .setColor(MOD_YELLOW)
      .setTimestamp();

    // Try to DM the user
    try {
      await targetUser.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ You've Received a Warning")
            .setDescription(`**Server:** ${interaction.guild?.name}\n**Reason:** ${reason}`)
            .setColor(MOD_YELLOW)
            .setTimestamp(),
        ],
      });
      embed.addFields({ name: "DM", value: "✅ Notified via DM" });
    } catch {
      embed.addFields({ name: "DM", value: "⚠️ Could not DM user" });
    }

    await interaction.editReply({ embeds: [embed] });
  },

  async handleMute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const targetMember = interaction.options.getMember("member") as GuildMember;
    const duration = interaction.options.getInteger("duration") || 30;
    const reason = interaction.options.getString("reason", true);

    if (!targetMember) {
      await interaction.editReply({ content: "⚠️ Could not find that member." });
      return;
    }

    // Find or create muted role
    let mutedRole = interaction.guild?.roles.cache.find((role) => role.name === "Muted");
    
    if (!mutedRole) {
      try {
        mutedRole = await interaction.guild?.roles.create({
          name: "Muted",
          color: 0x808080,
          reason: "Mute role for moderation",
        });
      } catch (error) {
        console.error("Failed to create muted role:", error);
        await interaction.editReply({ content: "⚠️ Failed to create muted role." });
        return;
      }
    }

    // Apply muted role
    try {
      await targetMember.roles.add(mutedRole!);
    } catch (error) {
      console.error("Failed to mute member:", error);
      await interaction.editReply({ content: "⚠️ Failed to mute member." });
      return;
    }

    // Schedule unmute
    setTimeout(async () => {
      try {
        const fetchedMember = await interaction.guild?.members.fetch(targetMember.id);
        if (fetchedMember?.roles.cache.has(mutedRole!.id)) {
          await fetchedMember.roles.remove(mutedRole!);
        }
      } catch (error) {
        console.error("Failed to unmute member:", error);
      }
    }, duration * 60 * 1000);

    // Log moderation action
    await this.logModerationAction(interaction, "mute", targetMember.user, `${reason} (${duration} min)`);

    const embed = new EmbedBuilder()
      .setTitle("🔇 Member Muted")
      .setDescription(`**Member:** ${targetMember}\n**Duration:** ${duration} minutes\n**Reason:** ${reason}`)
      .addFields({
        name: "Issued By",
        value: interaction.user.toString(),
      })
      .setColor(MOD_YELLOW)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleKick(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const targetMember = interaction.options.getMember("member") as GuildMember;
    const reason = interaction.options.getString("reason", true);

    if (!targetMember) {
      await interaction.editReply({ content: "⚠️ Could not find that member." });
      return;
    }

    if (!targetMember.kickable) {
      await interaction.editReply({ content: "⚠️ I cannot kick this member." });
      return;
    }

    // Log moderation action first
    await this.logModerationAction(interaction, "kick", targetMember.user, reason);

    // Kick the member
    try {
      await targetMember.kick(reason);
    } catch (error) {
      console.error("Failed to kick member:", error);
      await interaction.editReply({ content: "⚠️ Failed to kick member." });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("👢 Member Kicked")
      .setDescription(`**Member:** ${targetMember.user.tag}\n**Reason:** ${reason}`)
      .addFields({
        name: "Issued By",
        value: interaction.user.toString(),
      })
      .setColor(MOD_RED)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleBan(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const targetUser = interaction.options.getUser("member", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const deleteMessages = interaction.options.getBoolean("delete_messages") ?? false;

    // Log moderation action first
    await this.logModerationAction(interaction, "ban", targetUser, reason);

    // Ban the member
    try {
      await interaction.guild?.members.ban(targetUser, {
        reason: reason,
        deleteMessageSeconds: deleteMessages ? 86400 : 0,
      });
    } catch (error) {
      console.error("Failed to ban member:", error);
      await interaction.editReply({ content: "⚠️ Failed to ban member." });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🔨 Member Banned")
      .setDescription(`**Member:** ${targetUser.tag}\n**Reason:** ${reason}\n**Deleted Messages:** ${deleteMessages ? "Yes (24h)" : "No"}`)
      .addFields({
        name: "Issued By",
        value: interaction.user.toString(),
      })
      .setColor(MOD_RED)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleLockdown(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const action = interaction.options.getString("action", true) as "lock" | "unlock";
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const reason = interaction.options.getString("reason") || "Moderation lockdown";

    if (!channel || !("send" in channel)) {
      await interaction.editReply({ content: "⚠️ Please select a text channel." });
      return;
    }

    try {
      if (action === "lock") {
        // Remove send messages permission from @everyone
        if ("permissionOverwrites" in channel) {
          await channel.permissionOverwrites.edit(
            interaction.guild?.roles.everyone!,
            { SendMessages: false },
            { reason: reason }
          );
        }

        const embed = new EmbedBuilder()
          .setTitle("🔒 Channel Locked")
          .setDescription(`**Channel:** ${channel}\n**Reason:** ${reason}`)
          .addFields({
            name: "Issued By",
            value: interaction.user.toString(),
          })
          .setColor(MOD_YELLOW)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Send confirmation in channel
        if ("send" in channel) {
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("🔒 Channel Locked")
                .setDescription(reason)
                .setColor(MOD_YELLOW)
                .setTimestamp(),
            ],
          });
        }
      } else {
        // Restore send messages permission
        if ("permissionOverwrites" in channel) {
          await channel.permissionOverwrites.edit(
            interaction.guild?.roles.everyone!,
            { SendMessages: null },
            { reason: "Lockdown lifted" }
          );
        }

        const embed = new EmbedBuilder()
          .setTitle("🔓 Channel Unlocked")
          .setDescription(`**Channel:** ${channel}`)
          .addFields({
            name: "Issued By",
            value: interaction.user.toString(),
          })
          .setColor(MOD_GREEN)
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        // Send confirmation in channel
        if ("send" in channel) {
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("🔓 Channel Unlocked")
                .setDescription("Normal operations have resumed.")
                .setColor(MOD_GREEN)
                .setTimestamp(),
            ],
          });
        }
      }
    } catch (error) {
      console.error("Failed to update channel permissions:", error);
      await interaction.editReply({ content: "⚠️ Failed to update channel permissions." });
    }
  },

  async handleAnnounce(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const title = interaction.options.getString("title", true);
    const message = interaction.options.getString("message", true);
    const channelId = interaction.options.getString("channel");
    
    // Get target channel
    const targetChannel = channelId
      ? interaction.client.channels.cache.get(channelId)
      : interaction.guild?.channels.cache.find((ch) => ch.name === "announcements");

    if (!targetChannel || !("send" in targetChannel)) {
      await interaction.editReply({ content: "⚠️ Announcement channel not found." });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${title}`)
      .setDescription(message)
      .setColor(ARGENT_SILVER)
      .setTimestamp()
      .setFooter({ text: `Announced by ${interaction.user.username}` });

    try {
      if ("send" in targetChannel) {
        await targetChannel.send({ embeds: [embed] });
      }
      
      const replyEmbed = new EmbedBuilder()
        .setTitle("✅ Announcement Sent")
        .setDescription(`**Channel:** ${targetChannel}\n**Title:** ${title}`)
        .setColor(MOD_GREEN)
        .setTimestamp();

      await interaction.editReply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Failed to send announcement:", error);
      await interaction.editReply({ content: "⚠️ Failed to send announcement." });
    }
  },

  async handleLogs(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const limit = interaction.options.getInteger("limit") ?? 10;

    const { data: logs, error } = await supabase
      .from("moderation_actions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Failed to fetch logs:", error);
      await interaction.editReply({ content: "⚠️ Failed to fetch moderation logs." });
      return;
    }

    if (!logs || logs.length === 0) {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("📋 Moderation Logs")
            .setDescription("No moderation actions recorded yet.")
            .setColor(ARGENT_SILVER)
            .setTimestamp(),
        ],
      });
      return;
    }

    const logList = logs.map((log) => {
      const actionIcon = log.action === "ban" ? "🔨" : log.action === "kick" ? "👢" : log.action === "mute" ? "🔇" : "⚠️";
      const date = new Date(log.created_at).toLocaleDateString();
      return `${actionIcon} **${log.action.toUpperCase()}** - ${log.target_user_id?.substring(0, 8) || "Unknown"}\n   └ ${log.reason || "No reason"}\n   └ ${date}`;
    }).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle("📋 Moderation Logs")
      .setDescription(logList)
      .setColor(ARGENT_SILVER)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async logModerationAction(
    interaction: ChatInputCommandInteraction,
    action: string,
    targetUser: any,
    reason: string
  ) {
    // Get moderator's Discord account
    const { data: modAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    // Get target's Discord account
    const { data: targetAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", targetUser.id)
      .single();

    await supabase.from("moderation_actions").insert({
      moderator_id: modAccount?.user_id,
      target_user_id: targetAccount?.user_id,
      action: action,
      reason: reason,
      discord_target_id: targetUser.id,
      metadata: {
        guild_id: interaction.guild?.id,
        channel_id: interaction.channelId,
      },
    });
  },
};
