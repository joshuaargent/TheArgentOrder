import { Events, type GuildMember, TextChannel } from "discord.js";
import { EMBED_COLORS, GUILD_ID, WELCOME_CHANNEL_ID } from "../lib/constants";
import { supabase } from "../index";
import type { BotClient } from "../index";

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(client: BotClient, member: GuildMember) {
    // Only process for the main server
    if (GUILD_ID && member.guild.id !== GUILD_ID) return;

    console.log(`New member joined: ${member.user.tag}`);

    try {
      // Send welcome DM (with fallback to channel)
      const dmSent = await sendWelcomeDM(member);

      // Try to assign new member role
      await assignNewMemberRole(member);

      // Auto-assign to pod if linked
      const podAssigned = await autoAssignPod(member);

      // If DM failed and pod assigned, post to welcome channel
      if (!dmSent && podAssigned) {
        await sendWelcomeChannelMessage(client, member, podAssigned);
      }

      // If not linked, send reminder after delay
      if (!podAssigned) {
        await scheduleLinkReminder(member);
      }

    } catch (error) {
      console.error("Error in guildMemberAdd event:", error);
    }
  },
};

async function sendWelcomeDM(member: GuildMember): Promise<boolean> {
  const portalUrl = process.env.PORTAL_URL || "https://portal.theargentorder.com";

  // Check if already linked via OAuth (they have Initiate role)
  const hasInitiateRole = member.roles.cache.some(
    (r) => r.name.toLowerCase() === "initiate"
  );

  const welcomeMessage = {
    content: undefined,
    embeds: [
      {
        title: "⚔️ WELCOME TO THE ARGENT ORDER",
        description: hasInitiateRole
          ? "**You are now an Initiate.**\n\nThis is not a community. This is a forge.\n\n**Your first 72 hours:**\n\n1. Read #welcome and #mission\n2. Introduce yourself in #introductions\n3. Complete **/checkin** TODAY\n4. Join a campaign: **/campaign list**\n5. Use **/pod info** to meet your accountability brothers\n\n**Execute. Build. Lead.**\n\nYour portal: " + portalUrl + "/dashboard"
          : "**You've entered the Order.**\n\nNow prove you belong here.\n\n**Your activation:**\n" + portalUrl + "\n\nUse **/link** to connect your Discord account.\n\nOnce linked:\n• Read #welcome and #mission\n• Introduce yourself in #introductions\n• Complete **/checkin** TODAY\n• Join a campaign\n• Get assigned to your accountability pod\n\n**No spectators. Only brothers.**",
        color: EMBED_COLORS.PRIMARY,
        footer: {
          text: "⚔️ Execute. Build. Lead.",
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
                label: "Activate Now",
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
    return true;
  } catch (error) {
    // User might have DMs disabled - not an error
    console.log(`Could not send DM to ${member.user.tag} (DMs disabled)`);
    return false;
  }
}

async function sendWelcomeChannelMessage(client: BotClient, member: GuildMember, podInfo: { name: string } | null) {
  try {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === "welcome" || ch.id === WELCOME_CHANNEL_ID
    ) as TextChannel;

    if (!channel) {
      console.log("No welcome channel found");
      return;
    }

    const portalUrl = process.env.PORTAL_URL || "https://portal.theargentorder.com";

    await channel.send({
      content: `<@${member.id}>`,
      embeds: [
        {
          title: "🔥 NEW BROTHER JOINED",
          description: `Welcome <@${member.id}> to the Order!\n\n` +
            (podInfo ? `Assigned to pod: **${podInfo.name}**\n` : "") +
            `\nMake them feel welcome, brothers.\n\n` +
            `Use **/pod info** to see your accountability group.`,
          color: EMBED_COLORS.PRIMARY,
          footer: {
            text: "Execute. Build. Lead.",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    });

    console.log(`Welcome channel message sent for ${member.user.tag}`);
  } catch (error) {
    console.error("Error sending welcome channel message:", error);
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

async function autoAssignPod(member: GuildMember): Promise<{ name: string } | null> {
  try {
    // Check if user is already linked
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", member.id)
      .single();

    if (!discordAccount) {
      console.log(`User ${member.user.tag} not linked yet - skipping pod assignment`);
      return null;
    }

    // Use the database function for pod assignment (handles rejoins properly)
    const { data: podId, error } = await supabase.rpc("auto_assign_user_to_pod", {
      p_user_id: discordAccount.user_id,
    });

    if (error || !podId) {
      console.log(`Could not assign pod for ${member.user.tag}:`, error);
      return null;
    }

    // Get pod name for notification
    const { data: pod } = await supabase
      .from("pods")
      .select("name")
      .eq("id", podId)
      .single();

    // Try to DM user about pod assignment
    try {
      await member.send(
        `🔥 You've been assigned to **${pod?.name || "a pod"}**!\n\n` +
        `Your pod is your accountability unit. Execute together.\n\n` +
        `Use **/pod info** to see your pod details and meet your brothers.`
      );
    } catch {
      // DM might fail if user has DMs disabled - that's ok
    }

    console.log(`Auto-assigned ${member.user.tag} to pod ${pod?.name}`);
    return pod ? { name: pod.name } : null;

  } catch (error) {
    console.error("Error auto-assigning pod:", error);
    return null;
  }
}

async function scheduleLinkReminder(member: GuildMember) {
  // For unlinked users, we'll store a reminder in the database
  // A background job (or scheduled function) can process these
  try {
    const portalUrl = process.env.PORTAL_URL || "https://portal.theargentorder.com";
    
    // Store reminder (will be picked up by a scheduled job or next bot startup)
    await supabase.from("discord_link_codes").insert({
      discord_id: member.id,
      code: "PENDING_LINK",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    console.log(`Link reminder scheduled for ${member.user.tag}`);

    // Send follow-up DM after a delay (simulated - in production use a job queue)
    setTimeout(async () => {
      try {
        // Check if still not linked
        const { data } = await supabase
          .from("discord_accounts")
          .select("user_id")
          .eq("discord_id", member.id)
          .single();

        if (!data) {
          await member.send({
            embeds: [
              {
                title: "⏰ Reminder: Link Your Account",
                description: `Hey brother, you haven't linked your account yet.\n\n` +
                  `Link your account to:\n` +
                  `• Get assigned to your accountability pod\n` +
                  `• Track your formation progress\n` +
                  `• Access all features\n\n` +
                  `Use **/link** or visit: ${portalUrl}/link`,
                color: EMBED_COLORS.WARNING || 0xf59e0b,
                footer: {
                  text: "Execute. Build. Lead.",
                },
                timestamp: new Date().toISOString(),
              },
            ],
          });
        }
      } catch {
        // Member might have left or DMs disabled
      }
    }, 24 * 60 * 60 * 1000); // 24 hours later

  } catch (error) {
    console.error("Error scheduling link reminder:", error);
  }
}
