import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  OverwriteType,
  RolePosition,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa; // Silver/Argent
const ARGENT_DARK = 0x1a1a2e;

// Full server structure based on documentation
const CATEGORIES = [
  { name: "👋 Welcome", emoji: "wave", channels: [
    { name: "welcome", type: "text", description: "First impression and rules" },
    { name: "mission", type: "text", description: "Why we exist", readOnly: true },
    { name: "constitution", type: "text", description: "Community expectations", readOnly: true },
    { name: "start-here", type: "text", description: "Onboarding guide", readOnly: true },
    { name: "faq", type: "text", description: "Common questions", readOnly: true },
    { name: "verification", type: "text", description: "Verify your account", readOnly: true },
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
    { name: "officer-room", type: "text", description: "Leadership discussion", private: true },
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

// Welcome messages for key channels
const WELCOME_MESSAGES: Record<string, { title: string; content: string }> = {
  "welcome": {
    title: "⚔️ Welcome to The Argent Order",
    content: `**Catholic Formation for Builders**

You have entered a brotherhood of men committed to faith, discipline, and building.

**What We Are:**
A Catholic men's formation community focused on becoming men of virtue who create lasting value.

**The Five Pillars:**
• Faith - Prayer, Scripture, Mass
• Discipline - Fitness, habits, execution
• Brotherhood - Accountability, pods, relationships
• Building - Projects, skills, creation
• Truth - Catholic intellectual tradition

**First Steps:**
1. Read #mission and #constitution
2. Complete #start-here
3. Introduce yourself in #introductions
4. Use /link to connect your portal account
5. Use /sync to get your rank role

**No spectators. Only brothers.**`
  },
  "mission": {
    title: "🎯 Our Mission",
    content: `**The Argent Order exists to form men who:**

**1. Pursue Holiness**
Through daily prayer, regular Sacraments, and deep Catholic faith.

**2. Build with Purpose**
Creating projects, businesses, and skills that outlive us.

**3. Hold Each Other Accountable**
Through pods, weekly meetings, and honest brotherhood.

**4. Think Clearly**
Engaging the Catholic intellectual tradition with rigor.

**Our Goal:**
Not mere community, but formation. Not entertainment, but execution. Not discussion, but transformation.

*"In sterling we trust."*`
  },
  "constitution": {
    title: "📜 The Argent Order Constitution",
    content: `**Core Principles**

**I am my brother's keeper.**
We hold each other accountable. We do not let brothers fade.

**Formation over comfort.**
We choose growth over ease. Every day counts.

**Action over words.**
We ship. We execute. We leave something behind.

**Truth over diplomacy.**
We speak honestly, with charity. No snowflakes.

**The Order protects:**
• Catholic Orthodoxy
• Brotherhood
• Formation
• Safety
• Mission

**The Order removes:**
• Heresy
• Harassment
• Pornography
• Chronic disengagement
• Disruption of formation

*Every brother agrees to these terms by joining.*`
  },
  "start-here": {
    title: "📋 Getting Started",
    content: `**Your First 72 Hours**

**Day 1:**
• Read #welcome, #mission, #constitution
• Connect Discord to portal: /link
• Sync your role: /sync

**Day 2:**
• Introduce yourself in #introductions
• Join a pod (ask in #accountability-pods)
• Complete your first #roll-call

**Day 3:**
• Pick a campaign: /campaign list
• Set up your Rule of Life
• Start your streak

**Required Commands:**
• /link - Connect portal account
• /sync - Get your rank role
• /checkin - Daily formation check-in
• /pray - Log prayer

*"The forge is hot. Begin hammering."*`
  },
  "faq": {
    title: "❓ Frequently Asked Questions",
    content: `**Q: I'm not very religious. Can I join?**
A: This is a Catholic formation community. You don't need to be perfect, just willing to grow in faith.

**Q: What if I don't have a project or business?**
A: Building is a pillar, not a prerequisite. Start where you are.

**Q: How much time does this require?**
A: Formation is daily work. Plan 30-60 minutes minimum daily.

**Q: What are pods?**
A: Small groups of 4-8 men who hold each other accountable. You'll be assigned one.

**Q: Can I just lurk?**
A: No. Brotherhood requires participation. We track engagement.

**Q: I'm a married man/father. Is this for me?**
A: Yes. Many brothers are married with families. Formation serves your vocation.

**Q: Is this a trad Catholic thing?**
A: We hold to Catholic orthodoxy. How you live that is between you and your priest.`
  },
  "verification": {
    title: "🔐 Account Verification",
    content: `**Verify your account to access The Argent Order.**

1. Use **/link** to generate a connection code
2. Enter the code on The Argent Order portal
3. Use **/sync** to get your rank role

This connects your Discord account to your formation profile.

If you need help, ask in #brother-support.`
  }
};

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
        content: "⚔️ Setting up The Argent Order server structure...\n\nThis may take a moment.",
      });

      const { categoriesCreated, channelsCreated, rolesCreated, rolesUpdated } = await setupServer(guild);
      
      await interaction.editReply({
        content: `⚔️ **Server Setup Complete!**\n\n📁 ${categoriesCreated} categories created\n💬 ${channelsCreated} channels created\n👔 ${rolesCreated} roles created/updated\n\nRun **/sync all** to sync member roles.`,
      });

    } catch (error) {
      console.error("Setup failed:", error);
      await interaction.editReply({
        content: `❌ Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  },
};

async function setupServer(guild: any) {
  let categoriesCreated = 0;
  let channelsCreated = 0;
  let rolesCreated = 0;
  let rolesUpdated = 0;

  // First, get existing channels and roles to avoid duplicates
  const existingChannels = guild.channels.cache;
  const existingRoles = guild.roles.cache;

  // Create or find roles first (needed for permissions)
  const roleMap = new Map<string, any>();
  
  for (const roleDef of ROLES) {
    let role = existingRoles.find((r: any) => r.name === roleDef.name);
    
    if (!role) {
      role = await guild.roles.create({
        name: roleDef.name,
        color: roleDef.color as any,
        hoist: roleDef.hoist,
        position: roleDef.position,
      });
      rolesCreated++;
    } else {
      // Update existing role
      if (role.color !== roleDef.color || role.hoist !== roleDef.hoist) {
        await role.edit({
          color: roleDef.color as any,
          hoist: roleDef.hoist,
        });
        rolesUpdated++;
      }
    }
    roleMap.set(roleDef.name, role);
  }

  // Get the @everyone role
  const everyoneRole = guild.roles.everyone;

  // Create categories and channels
  for (const catDef of CATEGORIES) {
    // Check if category already exists
    let category = existingChannels.find(
      (c: any) => c.type === ChannelType.GuildCategory && c.name === catDef.name
    );

    if (!category) {
      category = await guild.channels.create({
        name: catDef.name,
        type: ChannelType.GuildCategory,
      });
      categoriesCreated++;
    }

    for (const chDef of catDef.channels) {
      // Check if channel already exists (by name within category)
      const existingChannel = existingChannels.find(
        (c: any) => c.name === chDef.name && c.parentId === category.id
      );

      if (!existingChannel) {
        const channelType = chDef.type === "announcement" 
          ? ChannelType.GuildAnnouncement 
          : ChannelType.GuildText;
        
        const channelOptions: any = {
          name: chDef.name,
          type: channelType,
          parent: category.id,
          topic: chDef.description,
        };

        // Set permissions for private channels
        if (chDef.private) {
          const officerRole = roleMap.get("Officer");
          const mentorRole = roleMap.get("Mentor");
          
          channelOptions.permissionOverwrites = [
            {
              id: everyoneRole.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            ...(officerRole ? [{ id: officerRole.id, allow: [PermissionFlagsBits.ViewChannel] }] : []),
            ...(mentorRole ? [{ id: mentorRole.id, allow: [PermissionFlagsBits.ViewChannel] }] : []),
          ];
        }

        const channel = await guild.channels.create(channelOptions);
        channelsCreated++;

        // Send welcome message if defined
        const welcomeInfo = WELCOME_MESSAGES[chDef.name];
        if (welcomeInfo) {
          const welcomeEmbed = new EmbedBuilder()
            .setTitle(welcomeInfo.title)
            .setDescription(welcomeInfo.content)
            .setColor(ARGENT_SILVER)
            .setTimestamp();

          // Pin the message for read-only channels
          const welcomeMsg = await channel.send({ embeds: [welcomeEmbed] });
          if (chDef.readOnly) {
            await channel.messages.fetch({ limit: 1 });
          }
        }
      }
    }
  }

  // Create voice channels category
  let voiceCategory = existingChannels.find(
    (c: any) => c.type === ChannelType.GuildCategory && c.name === "🔊 Voice Channels"
  );

  if (!voiceCategory) {
    voiceCategory = await guild.channels.create({
      name: "🔊 Voice Channels",
      type: ChannelType.GuildCategory,
    });
    categoriesCreated++;
  }

  const voiceChannels = [
    "Morning Prayer",
    "Evening Prayer",
    "Deep Work Hall",
    "Study Hall",
    "Builder Roundtable",
    "Brotherhood Lounge",
  ];

  for (const vc of voiceChannels) {
    const existingVC = existingChannels.find(
      (c: any) => c.name === vc && c.parentId === voiceCategory.id
    );
    
    if (!existingVC) {
      await guild.channels.create({
        name: vc,
        type: ChannelType.GuildVoice,
        parent: voiceCategory.id,
      });
      channelsCreated++;
    }
  }

  return { categoriesCreated, channelsCreated, rolesCreated, rolesUpdated };
}
