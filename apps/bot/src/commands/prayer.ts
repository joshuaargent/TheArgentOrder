import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;
const PRAYER_PURPLE = 0x7c3aed;
const ANSWERED_GREEN = 0x10b981;

interface PrayerRequest {
  id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  is_answered: boolean;
  created_at: string;
  username?: string;
}

export default {
  data: new SlashCommandBuilder()
    .setName("prayer")
    .setDescription("Prayer wall - request, answer, and pray for brothers")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("request")
        .setDescription("Submit a prayer request")
        .addStringOption((option) =>
          option
            .setName("request")
            .setDescription("Your prayer request")
            .setRequired(true)
            .setMaxLength(500)
        )
        .addBooleanOption((option) =>
          option
            .setName("anonymous")
            .setDescription("Submit anonymously? (Officers will see your name)")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("answered")
        .setDescription("Mark a prayer as answered")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Prayer request ID")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("testimony")
            .setDescription("Share how God answered your prayer (optional)")
            .setRequired(false)
            .setMaxLength(1000)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View current prayer requests")
        .addIntegerOption((option) =>
          option
            .setName("limit")
            .setDescription("Number of requests to show (default: 10)")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("mine")
        .setDescription("View your prayer requests")
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "request":
        await this.handleRequest(interaction);
        break;
      case "answered":
        await this.handleAnswered(interaction);
        break;
      case "list":
        await this.handleList(interaction);
        break;
      case "mine":
        await this.handleMine(interaction);
        break;
    }
  },

  async handleRequest(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const requestText = interaction.options.getString("request", true);
    const isAnonymous = interaction.options.getBoolean("anonymous") ?? false;

    // Get Discord account for user
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id, username")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use the OAuth invite..")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Insert prayer request into a notifications or dedicated table
    // For now, we'll use the journal_entries table with a special tag
    const { data, error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: discordAccount.user_id,
        title: "Prayer Request",
        content: requestText,
        visibility: "pod", // Only visible to pod members
        metadata: {
          type: "prayer_request",
          is_anonymous: isAnonymous,
          is_answered: false,
          discord_username: isAnonymous ? null : interaction.user.username,
        },
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create prayer request:", error);
      await interaction.editReply({
        content: "⚠️ Failed to submit prayer request. Please try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🙏 PRAYER REQUEST SUBMITTED")
      .setDescription(requestText)
      .addFields(
        {
          name: "ID",
          value: data.id.substring(0, 8),
          inline: true,
        },
        {
          name: "Privacy",
          value: isAnonymous ? "Anonymous" : "Visible to pod",
          inline: true,
        }
      )
      .setColor(PRAYER_PURPLE)
      .setTimestamp()
      .setFooter({ text: "Your brothers intercede for you.." });

    await interaction.editReply({ embeds: [embed] });

    // Optionally send to a prayer channel
    const prayerChannelId = process.env.PRAYER_CHANNEL_ID;
    if (prayerChannelId) {
      try {
        const prayerChannel = await interaction.client.channels.fetch(prayerChannelId);
        if (prayerChannel?.isTextBased()) {
          const notificationEmbed = new EmbedBuilder()
            .setTitle("🙏 New Prayer Request")
            .setDescription(requestText.length > 200 ? requestText.substring(0, 200) + "..." : requestText)
            .addFields({
              name: "React with 🙏",
              value: "Show your brothers you're praying",
            })
            .setColor(PRAYER_PURPLE)
            .setTimestamp();

          const message = await (prayerChannel as { send: Function }).send({ embeds: [notificationEmbed] });
          await message.react("🙏");
        }
      } catch (err) {
        console.error("Failed to send to prayer channel:", err);
      }
    }
  },

  async handleAnswered(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const prayerId = interaction.options.getString("id", true);
    const testimony = interaction.options.getString("testimony");

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use the OAuth invite..")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Update the prayer request
    const { error } = await supabase
      .from("journal_entries")
      .update({
        metadata: {
          type: "prayer_request",
          is_answered: true,
          answered_at: new Date().toISOString(),
          testimony: testimony || null,
        },
      })
      .eq("id", prayerId)
      .eq("user_id", discordAccount.user_id);

    if (error) {
      console.error("Failed to mark prayer as answered:", error);
      await interaction.editReply({
        content: "⚠️ Failed to mark prayer as answered. Please check the ID and try again.",
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("✨ Prayer Answered!")
      .setDescription(testimony ? `**Praise Report:**\n${testimony}` : "Glory to God!")
      .addFields({
        name: "Thank God!",
        value: "Share your testimony with your brothers when you're ready.",
      })
      .setColor(ANSWERED_GREEN)
      .setTimestamp()
      .setFooter({ text: "Execute. Build. Lead. In Christ.." });

    await interaction.editReply({ embeds: [embed] });

    // Post testimony to a channel if provided
    const testimonyChannelId = process.env.TESTIMONY_CHANNEL_ID;
    if (testimonyChannelId && testimony) {
      try {
        const channel = await interaction.client.channels.fetch(testimonyChannelId);
        if (channel?.isTextBased()) {
          const testimonyEmbed = new EmbedBuilder()
            .setTitle("✨ Prayer Answered!")
            .setDescription(testimony)
            .setColor(ANSWERED_GREEN)
            .setTimestamp()
            .setFooter({ text: `Shared by ${interaction.user.username}` });

          await (channel as { send: Function }).send({ embeds: [testimonyEmbed] });
        }
      } catch (err) {
        console.error("Failed to post testimony:", err);
      }
    }
  },

  async handleList(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const limit = interaction.options.getInteger("limit") ?? 10;

    // Get Discord account
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", interaction.user.id)
      .single();

    if (!discordAccount) {
      const embed = new EmbedBuilder()
        .setTitle("⚠️ Account Not Linked")
        .setDescription("Link your account with **/link**, or use the OAuth invite..")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Get pod members for visibility filtering
    const { data: podMembership } = await supabase
      .from("pod_members")
      .select("pod_id")
      .eq("user_id", discordAccount.user_id)
      .single();

    // Fetch prayer requests
    let query = supabase
      .from("journal_entries")
      .select("id, content, created_at, metadata, discord_accounts!inner(username)")
      .eq("metadata->>type", "prayer_request")
      .eq("metadata->>is_answered", "false")
      .order("created_at", { ascending: false })
      .limit(limit);

    // Filter to pod if member of one
    if (podMembership) {
      // For now, just show unclaimed requests
      query = query.is("user_id", null); // Placeholder - would need pod filtering
    }

    const { data: requests, error } = await query;

    if (error) {
      console.error("Failed to fetch prayer requests:", error);
      await interaction.editReply({
        content: "⚠️ Failed to fetch prayer requests. Please try again.",
      });
      return;
    }

    if (!requests || requests.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("🙏 Prayer Wall")
        .setDescription("No active prayer requests right now.\nUse `/prayer request` to submit one.")
        .setColor(PRAYER_PURPLE)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const prayerList = requests.map((req: any, index: number) => {
      const meta = req.metadata || {};
      const author = meta.is_anonymous ? "Anonymous" : (req.discord_accounts?.username || "Unknown");
      const shortId = req.id.substring(0, 8);
      const content = req.content.length > 100 ? req.content.substring(0, 100) + "..." : req.content;

      return `**${index + 1}.** ${content}\n   └ ID: \`${shortId}\` • ${author}`;
    }).join("\n\n");

    const embed = new EmbedBuilder()
      .setTitle("🙏 Prayer Wall")
      .setDescription(prayerList)
      .addFields({
        name: "Need Prayer?",
        value: "Use `/prayer request <text>` to submit a request",
      })
      .setColor(PRAYER_PURPLE)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },

  async handleMine(interaction: ChatInputCommandInteraction) {
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
        .setDescription("Link your account with **/link**, or use the OAuth invite..")
        .setColor(0xf59e0b)
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Fetch user's prayer requests
    const { data: requests, error } = await supabase
      .from("journal_entries")
      .select("id, content, created_at, metadata")
      .eq("user_id", discordAccount.user_id)
      .eq("metadata->>type", "prayer_request")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Failed to fetch your prayers:", error);
      await interaction.editReply({
        content: "⚠️ Failed to fetch your prayers. Please try again.",
      });
      return;
    }

    if (!requests || requests.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle("🙏 Your Prayers")
        .setDescription("You haven't submitted any prayer requests yet.\nUse `/prayer request` to share a need.")
        .setColor(PRAYER_PURPLE)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    const prayerList = requests.map((req: any) => {
      const meta = req.metadata || {};
      const isAnswered = meta.is_answered ? "✨" : "⏳";
      const shortId = req.id.substring(0, 8);
      const content = req.content.length > 80 ? req.content.substring(0, 80) + "..." : req.content;

      return `${isAnswered} ${content}\n   └ ID: \`${shortId}\` • ${new Date(req.created_at).toLocaleDateString()}`;
    }).join("\n\n");

    const answeredCount = requests.filter((r: any) => r.metadata?.is_answered).length;

    const embed = new EmbedBuilder()
      .setTitle("🙏 Your Prayers")
      .setDescription(prayerList)
      .addFields({
        name: "Summary",
        value: `${answeredCount}/${requests.length} answered`,
      })
      .setColor(PRAYER_PURPLE)
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  },
};
