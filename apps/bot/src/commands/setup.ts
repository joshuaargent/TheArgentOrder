import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;

// Optimized server structure - Catholic + Andrew Tate + Alex Hormozi
// 6 categories matching the FIVE PILLARS + coordination
// Reduced from 13 categories to eliminate overwhelm
const CATEGORIES = [
  // 1. FORGE - The daily heart (Discipline pillar)
  // This is where habits are built. Every brother reports here daily.
  { 
    name: "⚡ FORGE", 
    channels: [
      { name: "roll-call", type: "text", description: "Daily check-in - REQUIRED. Report: Prayer ✅ Workout ✅ Work ✅", pinned: true },
      { name: "daily-wins", type: "text", description: "Victories of the day. No matter how small." },
      { name: "daily-failures", type: "text", description: "Honest accountability. What did you fail? Own it." },
      { name: "fitness", type: "text", description: "Training, discipline, physical excellence" },
    ]
  },
  // 2. CHAPEL - Faith foundation (Faith pillar)
  // Spiritual formation. The most important category.
  { 
    name: "🙏 CHAPEL", 
    channels: [
      { name: "gospel", type: "text", description: "Daily Gospel readings. Bot-posted each morning.", pinned: true },
      { name: "prayer-requests", type: "text", description: "Lift up intentions. Brothers pray." },
      { name: "mass-attendance", type: "text", description: "Weekly Mass attendance confirmation" },
      { name: "rosary", type: "text", description: "Rosary intentions and challenges" },
    ]
  },
  // 3. PODS - Brotherhood & accountability (Brotherhood pillar)
  // Where men hold each other accountable
  { 
    name: "🔥 PODS", 
    channels: [
      { name: "my-pod", type: "text", description: "Your pod channel - assigned automatically" },
      { name: "pod-wins", type: "text", description: "Pod victories. Brothers building together." },
      { name: "accountability", type: "text", description: "Call each other up. No excuses." },
    ]
  },
  // 4. WORKSHOP - Building & shipping (Building pillar)
  // What are you building? Ship or be shipped.
  { 
    name: "🛠️ WORKSHOP", 
    channels: [
      { name: "ship-log", type: "text", description: "Weekly output. What did you ship? REQUIRED.", pinned: true },
      { name: "projects", type: "text", description: "Show your work. Apps, businesses, content." },
      { name: "build-help", type: "text", description: "Technical questions. Get answers." },
    ]
  },
  // 5. FORUM - Truth & intellectual formation (Truth pillar)
  // Catholic intellectual tradition. Think clearly.
  { 
    name: "📖 FORUM", 
    channels: [
      { name: "books", type: "text", description: "What are you reading? Share insights." },
      { name: "debates", type: "text", description: "Structured discussion. Attack ideas, not people." },
      { name: "catechism", type: "text", description: "Catholic teaching. Questions and answers." },
    ]
  },
  // 6. COMMAND - Leadership coordination
  // Announcements and campaigns. Don't miss these.
  { 
    name: "🎯 COMMAND", 
    channels: [
      { name: "announcements", type: "announcement", description: "Major updates. Read these.", pinned: true },
      { name: "campaigns", type: "text", description: "Active campaigns. Join one. Execute." },
      { name: "events", type: "text", description: "Upcoming events. Pod meetings, workshops." },
      { name: "newsletter", type: "text", description: "Archive of past newsletters", readOnly: true },
    ]
  },
  // 7. Welcome - Entry point (static info)
  { 
    name: "👋 WELCOME", 
    channels: [
      { name: "welcome", type: "text", description: "Start here. Read the rules.", pinned: true },
      { name: "mission", type: "text", description: "Why we exist", readOnly: true },
      { name: "constitution", type: "text", description: "Community expectations", readOnly: true },
      { name: "introductions", type: "text", description: "Introduce yourself - REQUIRED" },
      { name: "faq", type: "text", description: "Common questions", readOnly: true },
    ]
  },
  // 8. OPS - Private leadership channels (Officer+ only)
  { 
    name: "🔒 OPS", 
    channels: [
      { name: "officer-room", type: "text", description: "Leadership discussion", private: true },
      { name: "mod-log", type: "text", description: "Moderation records", private: true },
      { name: "planning", type: "text", description: "Campaign planning, content calendar", private: true },
    ],
    private: true
  },
];

// Voice channels - keep minimal, add more as needed
const VOICE_CHANNELS = [
  { name: "☀️ Morning Prayer", description: "Daily prayer - 6:30 AM" },
  { name: "🔥 Pod Meeting", description: "Weekly pod accountability call" },
  { name: "💪 Deep Work", description: "Silent work - mics muted" },
];

// Roles based on docs/05_ROLES_AND_PERMISSIONS.md
const ROLES = [
  // Core Rank Roles (formation progression)
  { name: "Visitor", color: "Grey", hoist: false, position: 1, type: "rank" },
  { name: "Initiate", color: "Blue", hoist: false, position: 2, type: "rank" },
  { name: "Brother", color: "Green", hoist: true, position: 3, type: "rank" },
  { name: "Veteran", color: "DarkGreen", hoist: true, position: 4, type: "rank" },
  { name: "Captain", color: "Orange", hoist: true, position: 5, type: "rank" },
  { name: "Officer", color: "Purple", hoist: true, position: 6, type: "rank" },
  { name: "Mentor", color: "Gold", hoist: true, position: 7, type: "rank" },
  { name: "Steward", color: "Red", hoist: true, position: 8, type: "rank" },
  
  // Functional Roles
  { name: "Pod Leader", color: "Cyan", hoist: true, type: "functional" },
  { name: "Builder", color: "Yellow", hoist: false, type: "functional" },
  { name: "Moderator", color: "DarkRed", hoist: true, type: "functional" },
  
  // Special/Achievement Roles
  { name: "Verified Builder", color: "LuminousVividPink", hoist: false, type: "special" },
  { name: "Top Contributor", color: "LightOrange", hoist: false, type: "special" },
  { name: "Streak Holder", color: "Fuchsia", hoist: false, type: "special" },
  { name: "Certified Mentor", color: "DarkGold", hoist: false, type: "special" },
];

// Welcome messages for key channels - action-oriented, masculine
const WELCOME_MESSAGES: Record<string, { title: string; content: string }> = {
  "welcome": {
    title: "⚔️ THE ARGENT ORDER",
    content: `**Catholic Men. Forged in Discipline. Building Legacy.**

You're now part of a brotherhood of men who refuse to be average.

**The Five Pillars:**
• ⚡ Discipline - Daily execution
• 🙏 Faith - Spiritual formation  
• 🔥 Brotherhood - Accountability
• 🛠️ Building - Create or be consumed
• 📖 Truth - Think clearly

**What we do here:**
Every day. No excuses. No spectators.

**Start here:**
1. Read #mission and #constitution
2. Introduce yourself in #introductions
3. Complete #roll-call daily
4. Ship something weekly in #ship-log

**The standard is high. The brotherhood is real.**

No mediocre men. Only brothers.`
  },
  "roll-call": {
    title: "📋 DAILY ROLL CALL - REQUIRED",
    content: `**Every day. Before noon.**

Post your status:

\`\`\`
Prayer: ✅/❌
Workout: ✅/❌  
Work: What you did today
\`\`\`

**This is non-negotiable.**

Miss 3 days without reason = flagged
Miss 7 days = removal from the Order

**Example:**
> Prayer: ✅
> Workout: ✅
> Work: Shipped landing page v2

No excuses. Own your day.`
  },
  "mission": {
    title: "🎯 OUR MISSION",
    content: `**We form men who:**

**1. Execute**
Daily habits. No excuses. Ship or die.

**2. Build**
Projects. Businesses. Content. Skills.
Leave something behind.

**3. Hold Each Other Accountable**
Pods. Check-ins. No man left behind.

**4. Think Clearly**
Catholic tradition. Intellectual rigor.
Not snowflakes. Not lukewarm.

**The Goal:**
Not community. Transformation.
Not discussion. Execution.
Not comfort. Forging.

*"In sterling we trust."*`
  },
  "constitution": {
    title: "📜 THE CONSTITUTION",
    content: `**Core Principles**

**Execute or leave.**
No spectators. No passengers.

**Accountability over comfort.**
We push each other. We don't enable excuses.

**Ship or be shipped.**
Build something. Create value. Leave a legacy.

**Truth over diplomacy.**
Speak clearly. Challenge ideas. No snowflakes.

**Catholic. Orthodox. Uncompromising.**
We hold to the faith. This is not negotiable.

**The Order removes:**
• Chronic disengagement
• Distraction culture
• Heresy or false teaching
• Pornography or degeneracy
• Disruption of formation

**This is not a social club.**
This is a forge.`
  },
  "introductions": {
    title: "📝 INTRODUCE YOURSELF - REQUIRED",
    content: `**Tell us who you are.**

Format:
\`\`\`
Name:
Age:
Vocation (single/married/priest):
Location:
What you're building:
Why you joined:
\`\`\`

**Example:**
> Name: Mike
> Age: 32
> Married with 2 kids
> Austin, TX
> Building: SaaS startup
> Joined: Need accountability to execute

Be real. We're brothers here.`
  },
  "ship-log": {
    title: "📦 WEEKLY SHIP LOG - REQUIRED",
    content: `**Every Sunday. What did you ship?**

Format:
\`\`\`
Week of [date]:
- [Project]: What you did
- [Skill]: What you learned
- [Content]: What you published
\`\`\`

**This is how we measure growth.**

Ship something or explain why you didn't.
No week passes without output.

**Example:**
> Week of Jan 15:
> - Argent Portal: Set up auth system
> - Marketing: Read "100M Offers"
> - Newsletter: Published issue #3`
  },
  "faq": {
    title: "❓ QUESTIONS",
    content: `**Q: I'm not very religious.**
A: You will be. Faith is a pillar here.

**Q: I don't have a project.**
A: Start one. Building is non-negotiable.

**Q: Can I lurk?**
A: No. Roll call is required. We track participation.

**Q: What if I fail?**
A: Own it. We celebrate honesty over performance.

**Q: Married with kids?**
A: Good. Formation serves your vocation.

**Q: How much time?**
A: 30-60 min daily minimum. This is serious.`
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

  // Helper to check if a role can view private channels
  const canViewPrivate = (roleName: string): boolean => {
    return ["Officer", "Mentor", "Steward", "Captain"].includes(roleName);
  };

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

    // Set category-level permissions for private categories
    if (catDef.private) {
      const overwrites: any[] = [{ id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] }];
      for (const [name, role] of roleMap) {
        if (canViewPrivate(name)) {
          overwrites.push({ id: role.id, allow: [PermissionFlagsBits.ViewChannel] });
        }
      }
      await category.edit({ permissionOverwrites: overwrites });
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
        if ((chDef as any).private || (catDef as any).private) {
          const overwrites: any[] = [{ id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] }];
          for (const [name, role] of roleMap) {
            if (canViewPrivate(name)) {
              overwrites.push({ id: role.id, allow: [PermissionFlagsBits.ViewChannel] });
            }
          }
          channelOptions.permissionOverwrites = overwrites;
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

          await channel.send({ embeds: [welcomeEmbed] });
        }
      }
    }
  }

  // Create voice channels category
  let voiceCategory = existingChannels.find(
    (c: any) => c.type === ChannelType.GuildCategory && c.name === "🔊 VOICE"
  );

  if (!voiceCategory) {
    voiceCategory = await guild.channels.create({
      name: "🔊 VOICE",
      type: ChannelType.GuildCategory,
    });
    categoriesCreated++;
  }

  for (const vc of VOICE_CHANNELS) {
    const existingVC = existingChannels.find(
      (c: any) => c.name === vc.name && c.parentId === voiceCategory.id
    );
    
    if (!existingVC) {
      await guild.channels.create({
        name: vc.name,
        type: ChannelType.GuildVoice,
        parent: voiceCategory.id,
      });
      channelsCreated++;
    }
  }

  return { categoriesCreated, channelsCreated, rolesCreated, rolesUpdated };
}
