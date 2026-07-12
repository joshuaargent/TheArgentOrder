import { Events, type GuildMember } from "discord.js";
import { EMBED_COLORS, GUILD_ID } from "../lib/constants";
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
      // Send welcome DM
      await sendWelcomeDM(member);

      // Try to assign new member role
      await assignNewMemberRole(member);

      // Auto-assign to pod if linked
      await autoAssignPod(member);

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
        title: "⚔️ WELCOME TO THE ARGENT ORDER",
        description: hasInitiateRole
          ? "**You are now an Initiate.**\n\nThis is not a community. This is a forge.\n\n**Your first 72 hours:**\n\n1. Read #welcome and #mission\n2. Introduce yourself in #introductions\n3. Complete /checkin TODAY\n4. Join a campaign: /campaign list\n5. Ship your first output in #ship-log\n\n**Execute. Build. Lead.**\n\nYour portal: " + portalUrl + "/dashboard"
          : "**You've entered the Order.**\n\nNow prove you belong here.\n\n**Your activation:**\n" + portalUrl + "\n\nUse /link to connect your Discord account.\n\nOnce linked:\n• Read #welcome and #mission\n• Introduce yourself in #introductions\n• Complete /checkin TODAY\n• Join a campaign\n\n**No spectators. Only brothers.**",
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

async function autoAssignPod(member: GuildMember) {
  try {
    // Check if user is already linked
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", member.id)
      .single();

    if (!discordAccount) {
      console.log(`User ${member.user.tag} not linked yet - skipping pod assignment`);
      return;
    }

    // Check if already in a pod
    const { data: existingMembership } = await supabase
      .from("pod_members")
      .select("id")
      .eq("user_id", discordAccount.user_id)
      .single();

    if (existingMembership) {
      console.log(`User ${member.user.tag} already in a pod - skipping`);
      return;
    }

    // Find a pod with available capacity (target: 5 members max)
    const { data: pods } = await supabase
      .from("pods")
      .select("id, name")
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (!pods || pods.length === 0) {
      console.log(`No active pods found - cannot auto-assign ${member.user.tag}`);
      return;
    }

    // Find pod with least members
    let selectedPod = null;
    let minMembers = Infinity;

    for (const pod of pods) {
      const { count } = await supabase
        .from("pod_members")
        .select("*", { count: "exact", head: true })
        .eq("pod_id", pod.id);

      if (count !== null && count < 5 && count < minMembers) {
        minMembers = count || 0;
        selectedPod = pod;
      }
    }

    // If all pods are full, use the one with fewest members
    if (!selectedPod && pods.length > 0) {
      let minCount = Infinity;
      for (const pod of pods) {
        const { count } = await supabase
          .from("pod_members")
          .select("*", { count: "exact", head: true })
          .eq("pod_id", pod.id);
        if ((count || 0) < minCount) {
          minCount = count || 0;
          selectedPod = pod;
        }
      }
    }

    if (!selectedPod) {
      console.log(`Could not find available pod for ${member.user.tag}`);
      return;
    }

    // Assign user to pod
    await supabase.from("pod_members").insert({
      pod_id: selectedPod.id,
      user_id: discordAccount.user_id,
      role: "member",
    });

    console.log(`Auto-assigned ${member.user.tag} to pod ${selectedPod.name}`);

    // Try to DM user about pod assignment
    try {
      await member.send(
        `🔥 You've been assigned to **${selectedPod.name}**!\n\n` +
        `Your pod is your accountability unit. Execute together.\n\n` +
        `Use /pod info to see your pod details.`
      );
    } catch {
      // DM might fail if user has DMs disabled
    }

  } catch (error) {
    console.error("Error auto-assigning pod:", error);
  }
}
