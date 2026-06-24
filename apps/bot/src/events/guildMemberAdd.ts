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

  const welcomeMessage = {
    content: undefined,
    embeds: [
      {
        title: "Welcome to The Argent Order, Brother.",
        description: `You've taken the first step. Now finish it.

Activate your portal to begin your formation tracking.

**${portalUrl}**

It takes 60 seconds. You'll connect your Discord account and get access to your personal dashboard.

This is where we'll track your:
• Daily formation habits
• Campaign progress  
• Streak and accountability

Your brothers are waiting. Your formation starts now.`,
        color: EMBED_COLORS.PRIMARY,
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/1329430844195328000/1329430844771082250/argent_cross.png",
        },
        footer: {
          text: "The Argent Order — Forged in Faith, Discipline, and Brotherhood",
        },
        timestamp: new Date().toISOString(),
      },
    ],
    components: [
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
    // Look for "New Member" or "Member" role
    const roleName = "New Member";
    const role = member.guild.roles.cache.find(
      (r) => r.name.toLowerCase() === roleName.toLowerCase()
    );

    if (role) {
      await member.roles.add(role);
      console.log(`Assigned ${roleName} role to ${member.user.tag}`);
    } else {
      console.log(`Role "${roleName}" not found in server`);
    }
  } catch (error) {
    console.error("Error assigning role:", error);
  }
}
