import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;

// Track bot message IDs for channels where welcome messages should stay at bottom
const botMessagesMap = new Map<string, string>();

// Expected channel names (lowercase for comparison)
const EXPECTED_CHANNELS = new Set([
  // WELCOME category
  "welcome", "mission", "constitution", "introductions", "faq",
  // FORGE category
  "roll-call", "daily-wins", "daily-failures", "fitness",
  // CHAPEL category
  "gospel", "prayer-requests", "mass-attendance", "rosary",
  // PODS category
  "my-pod", "pod-wins", "accountability",
  // WORKSHOP category
  "ship-log", "projects", "build-help",
  // FORUM category
  "books", "debates", "catechism",
  // COMMAND category
  "announcements", "campaigns", "events", "newsletter",
  // OPS category
  "officer-room", "mod-log", "planning",
]);

// Expected role names
const EXPECTED_ROLES = new Set([
  "Visitor", "Initiate", "Brother", "Veteran", "Captain", "Officer", "Mentor", "Steward",
  "Pod Leader", "Builder", "Moderator",
  "Verified Builder", "Top Contributor", "Streak Holder", "Certified Mentor",
]);

// Category definitions with access levels
const CATEGORIES = [
  {
    name: "👋 WELCOME",
    access: "all", // All roles can view
    channels: [
      { name: "welcome", description: "Start here. Read the rules." },
      { name: "mission", description: "Why we exist" },
      { name: "constitution", description: "Community expectations" },
      { name: "introductions", description: "Introduce yourself - REQUIRED" },
      { name: "faq", description: "Common questions" },
    ]
  },
  {
    name: "⚡ FORGE",
    access: "member", // Initiate+
    channels: [
      { name: "roll-call", description: "Daily check-in - REQUIRED. Prayer ✅ Workout ✅ Work ✅" },
      { name: "daily-wins", description: "Victories of the day." },
      { name: "daily-failures", description: "Honest accountability. Own your failures." },
      { name: "fitness", description: "Training, discipline, physical excellence" },
    ]
  },
  {
    name: "🙏 CHAPEL",
    access: "member",
    channels: [
      { name: "gospel", description: "Daily Gospel readings." },
      { name: "prayer-requests", description: "Lift up intentions. Brothers pray." },
      { name: "mass-attendance", description: "Weekly Mass attendance" },
      { name: "rosary", description: "Rosary intentions and challenges" },
    ]
  },
  {
    name: "🔥 PODS",
    access: "member",
    channels: [
      { name: "my-pod", description: "Your pod channel - assigned automatically" },
      { name: "pod-wins", description: "Pod victories. Brothers building together." },
      { name: "accountability", description: "Call each other up. No excuses." },
    ]
  },
  {
    name: "🛠️ WORKSHOP",
    access: "member",
    channels: [
      { name: "ship-log", description: "Weekly output. What did you ship? REQUIRED." },
      { name: "projects", description: "Show your work. Apps, businesses, content." },
      { name: "build-help", description: "Technical questions. Get answers." },
    ]
  },
  {
    name: "📖 FORUM",
    access: "member",
    channels: [
      { name: "books", description: "What are you reading? Share insights." },
      { name: "debates", description: "Structured discussion. Attack ideas, not people." },
      { name: "catechism", description: "Catholic teaching. Questions and answers." },
    ]
  },
  {
    name: "🎯 COMMAND",
    access: "member",
    channels: [
      { name: "announcements", description: "Major updates. Read these." },
      { name: "campaigns", description: "Active campaigns. Join one. Execute." },
      { name: "events", description: "Upcoming events. Pod meetings, workshops." },
      { name: "newsletter", description: "Archive of past newsletters" },
    ]
  },
  {
    name: "🔒 OPS",
    access: "leadership", // Officer+
    channels: [
      { name: "officer-room", description: "Leadership discussion" },
      { name: "mod-log", description: "Moderation records" },
      { name: "planning", description: "Campaign planning, content calendar" },
    ],
    private: true
  },
];

const VOICE_CHANNELS = [
  { name: "☀️ Morning Prayer" },
  { name: "🔥 Pod Meeting" },
  { name: "💪 Deep Work" },
];

// Role definitions
const ROLES = [
  { name: "Visitor", color: 0x808080, hoist: false, position: 1 },
  { name: "Initiate", color: 0x3498db, hoist: false, position: 2 },
  { name: "Brother", color: 0x2ecc71, hoist: true, position: 3 },
  { name: "Veteran", color: 0x27ae60, hoist: true, position: 4 },
  { name: "Captain", color: 0xf39c12, hoist: true, position: 5 },
  { name: "Officer", color: 0x9b59b6, hoist: true, position: 6 },
  { name: "Mentor", color: 0xf1c40f, hoist: true, position: 7 },
  { name: "Steward", color: 0xe74c3c, hoist: true, position: 8 },
  { name: "Pod Leader", color: 0x00bcd4, hoist: true },
  { name: "Builder", color: 0xffeb3b, hoist: false },
  { name: "Moderator", color: 0x8b0000, hoist: true },
  { name: "Verified Builder", color: 0xff69b4, hoist: false },
  { name: "Top Contributor", color: 0xffa500, hoist: false },
  { name: "Streak Holder", color: 0xff00ff, hoist: false },
  { name: "Certified Mentor", color: 0xb8860b, hoist: false },
];

// Welcome messages for key channels
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

**Start here:**
1. Read #mission and #constitution
2. Introduce yourself in #introductions
3. Complete #roll-call daily
4. Ship something weekly in #ship-log

**The standard is high. The brotherhood is real.**

Execute. Build. Lead.`
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

Miss 3 days = flagged
Miss 7 days = removal

No excuses. Own your day.`
  },
  "mission": {
    title: "🎯 OUR MISSION",
    content: `**We form men who:**

**1. Execute** - Daily habits. No excuses.
**2. Build** - Projects. Businesses. Skills.
**3. Hold Each Other Accountable** - Pods. Check-ins.
**4. Grow in Faith** - Prayer. Sacraments. Scripture.

**Execute. Build. Lead.**
This is not a hobby. This is a forge.`
  },
  "constitution": {
    title: "📜 CONSTITUTION",
    content: `**Article I: Purpose**
We form Catholic men through the Five Pillars.

**Article II: Standards**
• Daily execution is non-negotiable
• Brotherhood means accountability
• Building is first-class
• No spectators. Only brothers.

**Article III: Leadership**
Earned through: Character, Competence, Contribution, Consistency, Trust.

**Article IV: Removal**
Members may be removed for:
• Neglect of formation
• Harm to the brotherhood
• Violation of Catholic teaching

Execute. Build. Lead.`
  },
  "ship-log": {
    title: "📦 WEEKLY SHIP LOG",
    content: `**What did you build this week?**

Post every Sunday:
- What you shipped
- What you learned
- What's next

**Ship or be shipped.**`
  },
  "introductions": {
    title: "👋 INTRODUCE YOURSELF",
    content: `**Required within 24 hours.**

Post:
1. Name / What to call you
2. Where you're from
3. What you're building
4. One goal for 90 days

**No lurkers. Only brothers.**`
  },
  "faq": {
    title: "❓ FREQUENTLY ASKED",
    content: `**Q: How do I get promoted?**
A: Execute daily. Contribute. Build projects.

**Q: What's a pod?**
A: Your accountability unit. 5 brothers.

**Q: Check-ins per week?**
A: Minimum 5. Daily is standard.

**Q: What counts as "shipped"?**
A: Anything you created.

**Execute. Build. Lead.**`
  },
  "gospel": {
    title: "✝️ DAILY GOSPEL",
    content: `**Posted daily by bot.**

Read. Reflect. Pray.

**Sunday:** Mass is mandatory.

*Prayer:*
"Into my heart, O Lord, pour your word and your wisdom."`
  },
};

// Export for message handler
export { botMessagesMap, WELCOME_MESSAGES, EXPECTED_CHANNELS };

export default {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Set up The Argent Order server structure (Admin only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const guild = interaction.guild;
    
    if (!guild) {
      await interaction.editReply({ content: "❌ This command can only be used in a server." });
      return;
    }

    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.editReply({ content: "❌ Only administrators can run this command." });
      return;
    }

    try {
      const results = await setupServer(guild);
      
      const embed = new EmbedBuilder()
        .setTitle("✅ Server Setup Complete")
        .setColor(0x00ff00)
        .addFields(
          { name: "Roles", value: `${results.rolesCreated} created, ${results.rolesUpdated} updated, ${results.rolesDeleted} deleted`, inline: true },
          { name: "Categories", value: `${results.categoriesCreated} created`, inline: true },
          { name: "Channels", value: `${results.channelsCreated} created, ${results.channelsDeleted} deleted`, inline: true },
        )
        .setTimestamp()
        .setFooter({ text: "Execute. Build. Lead." });

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      console.error("Setup error:", error);
      await interaction.editReply({ content: `❌ Setup failed: ${error.message}` });
    }
  },
};

async function setupServer(guild: any) {
  let categoriesCreated = 0;
  let channelsCreated = 0;
  let channelsDeleted = 0;
  let rolesCreated = 0;
  let rolesUpdated = 0;
  let rolesDeleted = 0;

  const existingChannels = guild.channels.cache;
  const existingRoles = guild.roles.cache;

  // Get role references
  const roleMap = new Map<string, any>();
  const everyoneRole = guild.roles.everyone;

  // ============ ROLES ============
  // Create or update expected roles
  for (const roleDef of ROLES) {
    let role = existingRoles.find((r: any) => r.name === roleDef.name);
    
    if (!role) {
      role = await guild.roles.create({
        name: roleDef.name,
        color: roleDef.color,
        hoist: roleDef.hoist,
      });
      rolesCreated++;
    } else if (role.color !== roleDef.color || role.hoist !== roleDef.hoist) {
      await role.edit({ color: roleDef.color, hoist: roleDef.hoist });
      rolesUpdated++;
    }
    roleMap.set(roleDef.name, role);
  }

  // Delete unexpected roles
  for (const role of existingRoles.values()) {
    if (role.id === everyoneRole.id) continue;
    if (!EXPECTED_ROLES.has(role.name)) {
      await role.delete("Removing unexpected role");
      rolesDeleted++;
    }
  }

  // ============ CATEGORIES & CHANNELS ============
  for (const catDef of CATEGORIES) {
    // Check if category exists
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

    // Set category permissions based on access level
    await setCategoryPermissions(category, catDef, roleMap, everyoneRole);

    // Create or update channels
    for (const chDef of catDef.channels) {
      let channel = existingChannels.find(
        (c: any) => c.name === chDef.name && c.parentId === category.id
      );

      if (!channel) {
        channel = await guild.channels.create({
          name: chDef.name,
          type: ChannelType.GuildText,
          parent: category.id,
          topic: chDef.description,
        });
        channelsCreated++;
      } else {
        // Update topic if changed
        if (channel.topic !== chDef.description) {
          await channel.edit({ topic: chDef.description });
        }
      }

      // Send/update welcome message for key channels
      if (WELCOME_MESSAGES[chDef.name]) {
        await updateWelcomeMessage(channel);
      }
    }
  }

  // Create voice channels
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

  // ============ DELETE EXTRA CHANNELS ============
  for (const channel of existingChannels.values()) {
    if (channel.type === ChannelType.GuildCategory) {
      // Check if it's a recognized category
      const isRecognized = CATEGORIES.some(c => c.name === channel.name) || 
                          channel.name === "🔊 VOICE";
      if (!isRecognized) {
        // Delete all channels in this category first
        const childChannels = existingChannels.filter(
          (c: any) => c.parentId === channel.id
        );
        for (const child of childChannels.values()) {
          await child.delete("Removing extra channel");
          channelsDeleted++;
        }
        await channel.delete("Removing extra category");
        channelsDeleted++;
      }
    } else if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
      // Check if channel name is in expected list
      if (!EXPECTED_CHANNELS.has(channel.name.toLowerCase())) {
        await channel.delete("Removing extra channel");
        channelsDeleted++;
      }
    }
  }

  return { categoriesCreated, channelsCreated, channelsDeleted, rolesCreated, rolesUpdated, rolesDeleted };
}

async function setCategoryPermissions(category: any, catDef: any, roleMap: Map<string, any>, everyoneRole: any) {
  const overwrites: any[] = [];
  
  if (catDef.access === "all") {
    // Everyone can view - no overwrites needed (use defaults)
    return;
  }
  
  if (catDef.access === "member") {
    // Members (Initiate+) can view, Visitor cannot
    const visitorRole = roleMap.get("Visitor");
    if (visitorRole) {
      overwrites.push({
        id: visitorRole.id,
        deny: [PermissionFlagsBits.ViewChannel],
      });
    }
    // Everyone else (Initiate+) can view - implicit allow
    return;
  }
  
  if (catDef.access === "leadership" || catDef.private) {
    // Only leadership (Officer+) can view
    overwrites.push({
      id: everyoneRole.id,
      deny: [PermissionFlagsBits.ViewChannel],
    });
    
    const leadershipRoles = ["Officer", "Mentor", "Steward"];
    for (const roleName of leadershipRoles) {
      const role = roleMap.get(roleName);
      if (role) {
        overwrites.push({
          id: role.id,
          allow: [PermissionFlagsBits.ViewChannel],
        });
      }
    }
  }
  
  if (overwrites.length > 0) {
    await category.edit({ permissionOverwrites: overwrites });
  }
}

async function updateWelcomeMessage(channel: any) {
  const welcomeInfo = WELCOME_MESSAGES[channel.name];
  if (!welcomeInfo) return;

  // Find existing bot messages
  const messages = await channel.messages.fetch({ limit: 10 });
  const existingBotMsg = messages.find(
    (m: any) => m.author.id === channel.client.user?.id && 
               m.embeds.length > 0 && 
               m.embeds[0].title === welcomeInfo.title
  );

  if (existingBotMsg) {
    // Already exists - check if it's at the bottom
    const lastMsg = messages.first();
    if (lastMsg?.id !== existingBotMsg.id) {
      // Not at bottom - delete old and post new
      await existingBotMsg.delete();
      await sendWelcomeEmbed(channel, welcomeInfo);
    }
  } else {
    // No existing message - check if there are user messages
    const hasUserMessages = messages.some((m: any) => m.author.id !== channel.client.user?.id);
    
    if (hasUserMessages) {
      // Delete old bot messages if any, then post at bottom
      for (const msg of messages.values()) {
        if (msg.author.id === channel.client.user?.id) {
          await msg.delete();
        }
      }
      await sendWelcomeEmbed(channel, welcomeInfo);
    } else {
      // Empty channel - just send
      await sendWelcomeEmbed(channel, welcomeInfo);
    }
  }
}

async function sendWelcomeEmbed(channel: any, welcomeInfo: { title: string; content: string }) {
  const embed = new EmbedBuilder()
    .setTitle(welcomeInfo.title)
    .setDescription(welcomeInfo.content)
    .setColor(ARGENT_SILVER)
    .setTimestamp();

  await channel.send({ embeds: [embed] });
}
