import { Events, type GuildMember } from "discord.js";
import { EMBED_COLORS, GUILD_ID } from "../lib/constants";
import type { BotClient } from "../index";

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(client: BotClient, member: GuildMember) {
    // Only process for the main server
    if (GUILD_ID && member.guild.id !== GUILD_ID) return;

    console.log(`New member joined: ${member.user.tag}`);

    try {
      // Send welcome DM
      await sendWelcomeDM(member);

      // Try to assign new member role
      await assignNewMemberRole(member);

    } catch (error) {
      console.error("Error in guildMemberAdd event:", error);
    }
  },
};

async function sendWelcomeDM(member: GuildMember) {
  const portalUrl = process.env.PORTAL_URL || "https://portal.theargentorder.com";

  // Check if already linked via OAuth (they have Initiate role)
  const hasInitiateRole = member.roles.cache.some(
    (r) => r.name.toLowerCase() === "initiate"
  );

  const welcomeMessage = {
    content: undefined,
    embeds: [
      {
        title: "⚔️ Welcome to The Argent Order, Brother.",
        description: hasInitiateRole
          ? `Your account is linked. You're now an **Initiate**.

**Your first 72 hours:**

1. Read #welcome, #mission, #constitution
2. Introduce yourself in #introductions
3. Use /checkin to start your daily formation
4. Pick a campaign: /campaign list
5. Join a pod: ask in #accountability-pods

**Your portal is ready:**
${portalUrl}/dashboard

Track your formation, streaks, and progress there.`,
          : `You've joined the Order. Now activate your account.

**Activate your portal:**
${portalUrl}

Use the code from /link command to connect your Discord account.

Once linked:
• Complete your profile
• Read the Constitution
• Introduce yourself in #introductions
• Start your first check-in`,
        color: EMBED_COLORS.PRIMARY,
        footer: {
          text: "The Argent Order — Forged in Faith, Discipline, and Brotherhood",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    components: hasInitiateRole
      ? undefined
      : [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 5,
                label: "Activate Your Portal",
                url: portalUrl,
                emoji: {
                  name: "⚔️",
                },
              },
            ],
          },
        ],
  };

  try {
    await member.send(welcomeMessage);
    console.log(`Welcome DM sent to ${member.user.tag}`);
  } catch (error) {
    // User might have DMs disabled
    console.log(`Could not send DM to ${member.user.tag}:`, error);
  }
}

async function assignNewMemberRole(member: GuildMember) {
  try {
    // Per docs: When joining via portal OAuth, they become Initiate
    // Visitor is for those who join Discord directly without portal
    // After linking with /link and portal setup, they become Initiate
    
    // First try to find Initiate role (they came via portal OAuth)
    let role = member.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === "initiate"
    );
    
    // Fall back to Visitor if Initiate doesn't exist yet
    if (!role) {
      role = member.guild.roles.cache.find(
        (r) => r.name.toLowerCase() === "visitor"
      );
    }

    if (role) {
      await member.roles.add(role);
      console.log(`Assigned ${role.name} role to ${member.user.tag}`);
    } else {
      console.log(`No role found - run /setup to create roles`);
    }
  } catch (error) {
    console.error("Error assigning role:", error);
  }
}
