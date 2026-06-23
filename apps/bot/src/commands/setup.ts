import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { supabase } from "../index";

// Full server structure based on documentation
const CATEGORIES = [
  { name: "👋 Welcome", emoji: "wave", channels: [
    { name: "welcome", type: "text", description: "First impression and rules" },
    { name: "mission", type: "text", description: "Why we exist", readOnly: true },
    { name: "constitution", type: "text", description: "Community expectations", readOnly: true },
    { name: "start-here", type: "text", description: "Onboarding guide", readOnly: true },
    { name: "faq", type: "text", description: "Common questions", readOnly: true },
  ]},
  { name: "🙏 Chapel", emoji: "pray", channels: [
    { name: "daily-gospel", type: "text", description: "Daily Gospel readings" },
    { name: "prayer-requests", type: "text", description: "Prayer intentions" },
    { name: "prayer-victories", type: "text", description: "Answered prayers" },
    { name: "rosary", type: "text", description: "Rosary discussions" },
    { name: "saints", type: "text", description: "Saints and their lessons" },
    { name: "catechism", type: "text", description: "Catholic teaching" },
    { name: "apologetics", type: "text", description: "Defense of the faith" },
  ]},
  { name: "⚔️ Barracks", emoji: "sword", channels: [
    { name: "roll-call", type: "text", description: "Daily check-in - REQUIRED" },
    { name: "daily-wins", type: "text", description: "Daily victories" },
    { name: "fitness", type: "text", description: "Training and health" },
    { name: "nutrition", type: "text", description: "Diet and meal planning" },
    { name: "sleep", type: "text", description: "Sleep optimization" },
    { name: "discipline", type: "text", description: "Habits and execution" },
  ]},
  { name: "🏗️ Workshop", emoji: "hammer", channels: [
    { name: "coding", type: "text", description: "Development and programming" },
    { name: "startups", type: "text", description: "Business building" },
    { name: "business", type: "text", description: "Sales and marketing" },
    { name: "study", type: "text", description: "Learning and education" },
    { name: "projects", type: "text", description: "Show what you're building" },
    { name: "website-reviews", type: "text", description: "Feedback and improvement" },
    { name: "tools-and-resources", type: "text", description: "Useful resources" },
  ]},
  { name: "📖 Forum", emoji: "book", channels: [
    { name: "philosophy", type: "text", description: "Philosophical discussion" },
    { name: "logic-lab", type: "text", description: "Reasoning and analysis" },
    { name: "debates", type: "text", description: "Structured debate (rules enforced)" },
    { name: "books", type: "text", description: "Reading discussions" },
    { name: "current-events", type: "text", description: "News with Catholic perspective" },
  ]},
  { name: "🤝 Brotherhood", emoji: "handshake", channels: [
    { name: "introductions", type: "text", description: "Introduce yourself - REQUIRED" },
    { name: "accountability-pods", type: "text", description: "Pod coordination" },
    { name: "testimonies", type: "text", description: "Transformation stories" },
    { name: "victories", type: "text", description: "Major wins" },
    { name: "brother-support", type: "text", description: "Advice and encouragement" },
  ]},
  { name: "🎯 Command Center", emoji: "crosshair", channels: [
    { name: "announcements", type: "announcement", description: "Major updates", readOnly: true },
    { name: "weekly-directive", type: "text", description: "Weekly mission", readOnly: true },
    { name: "campaigns", type: "text", description: "Campaign updates" },
    { name: "newsletter", type: "text", description: "Newsletter archive", readOnly: true },
    { name: "events", type: "text", description: "Upcoming events" },
  ]},
  { name: "👥 Pods", emoji: "people", channels: [
    { name: "pod-alpha", type: "text", description: "Pod Alpha channel" },
    { name: "pod-beta", type: "text", description: "Pod Beta channel" },
  ]},
  { name: "🔒 Operations", emoji: "lock", channels: [
    { name: "officer-room", type: "text", description: "Leadership discussion" },
    { name: "moderation-log", type: "text", description: "Moderation records" },
    { name: "campaign-planning", type: "text", description: "Future campaigns" },
    { name: "portal-development", type: "text", description: "Platform development" },
  ], private: true},
];

const ROLES = [
  // Rank roles (in order of progression)
  { name: "Visitor", color: "Grey", hoist: false, position: 1 },
  { name: "Initiate", color: "Blue", hoist: false, position: 2 },
  { name: "Brother", color: "Green", hoist: true, position: 3 },
  { name: "Veteran", color: "DarkGreen", hoist: true, position: 4 },
  { name: "Captain", color: "Orange", hoist: true, position: 5 },
  { name: "Officer", color: "Purple", hoist: true, position: 6 },
  { name: "Mentor", color: "Gold", hoist: true, position: 7 },
  { name: "Steward", color: "Red", hoist: true, position: 8 },
  // Functional roles
  { name: "Pod Leader", color: "Cyan", hoist: true },
  { name: "Builder", color: "Yellow", hoist: false },
  { name: "Moderator", color: "DarkRed", hoist: true },
];

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up The Argent Order server structure (Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;
    
    if (!guild) {
      await interaction.editReply({
        content: "❌ This command can only be used in a server.",
      });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.editReply({
        content: "❌ Only administrators can run this command.",
      });
      return;
    }

    try {
      await interaction.editReply({
        content: "🔨 Setting up The Argent Order server structure...\n\nThis may take a moment.",
      });

      const createdCategories = await createCategories(guild);
      const createdRoles = await createRoles(guild);
      
      await interaction.editReply({
        content: `✅ Server structure created!\n\n📁 ${createdCategories.length} categories\n👔 ${createdRoles.length} roles\n\nRunning /sync to update member roles...`,
      });

    } catch (error) {
      console.error("Setup failed:", error);
      await interaction.editReply({
        content: `❌ Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  },
};

async function createCategories(guild: any) {
  const categories: any[] = [];

  for (const catDef of CATEGORIES) {
    const category = await guild.channels.create({
      name: catDef.name,
      type: ChannelType.GuildCategory,
    });
    categories.push(category);

    for (const chDef of catDef.channels) {
      const channelType = chDef.type === "announcement" 
        ? ChannelType.GuildAnnouncement 
        : ChannelType.GuildText;
      
      const channelOptions: any = {
        name: chDef.name,
        type: channelType,
        parent: category.id,
      };

      if (chDef.private) {
        channelOptions.permissionOverwrites = [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        ];
      }

      await guild.channels.create(channelOptions);
    }
  }

  // Create voice channels
  const voiceCategory = await guild.channels.create({
    name: "🔊 Voice Channels",
    type: ChannelType.GuildCategory,
  });
  categories.push(voiceCategory);

  const voiceChannels = [
    "Morning Prayer",
    "Evening Prayer",
    "Deep Work Hall",
    "Study Hall",
    "Builder Roundtable",
    "Brotherhood Lounge",
  ];

  for (const vc of voiceChannels) {
    await guild.channels.create({
      name: vc,
      type: ChannelType.GuildVoice,
      parent: voiceCategory.id,
    });
  }

  return categories;
}

async function createRoles(guild: any) {
  const roles: any[] = [];

  for (const roleDef of ROLES) {
    const discordRole = await guild.roles.create({
      name: roleDef.name,
      color: roleDef.color as any,
      hoist: roleDef.hoist,
    });
    roles.push(discordRole);
  }

  return roles;
}
