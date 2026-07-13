import { Events, type GuildMember } from "discord.js";
import { supabase } from "../index";
import type { BotClient } from "../index";

export default {
  name: Events.GuildMemberRemove,
  once: false,

  async execute(client: BotClient, member: GuildMember) {
    console.log(`Member left: ${member.user.tag}`);

    try {
      // Track the leave event
      await trackMemberLeave(member);
      
      // Notify pod members
      await notifyPodMembers(member);
      
    } catch (error) {
      console.error("Error in guildMemberRemove event:", error);
    }
  },
};

async function trackMemberLeave(member: GuildMember) {
  try {
    // Get user's database record
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", member.id)
      .single();

    if (!discordAccount) {
      console.log(`Unlinked member ${member.user.tag} left - no tracking needed`);
      return;
    }

    // Record the leave event
    await supabase.from("discord_leave_events").insert({
      discord_id: member.id,
      user_id: discordAccount.user_id,
    });

    // Check if they were in a pod
    const { data: membership } = await supabase
      .from("pod_members")
      .select("id, pod_id")
      .eq("user_id", discordAccount.user_id)
      .is("left_at", null)
      .single();

    if (membership) {
      // Note: We don't automatically mark them as left the pod
      // They can rejoin later and the auto_assign function handles it
      console.log(`Member ${member.user.tag} left Discord - pod membership preserved`);
    }

    console.log(`Leave tracked for ${member.user.tag}`);
  } catch (error) {
    console.error("Error tracking member leave:", error);
  }
}

async function notifyPodMembers(leftMember: GuildMember) {
  try {
    // Get the user's pod
    const { data: discordAccount } = await supabase
      .from("discord_accounts")
      .select("user_id")
      .eq("discord_id", leftMember.id)
      .single();

    if (!discordAccount) return;

    const { data: membership } = await supabase
      .from("pod_members")
      .select("pod_id")
      .eq("user_id", discordAccount.user_id)
      .is("left_at", null)
      .single();

    if (!membership) return;

    // Get pod captain for notification
    const { data: pod } = await supabase
      .from("pods")
      .select("name, captain_id")
      .eq("id", membership.pod_id)
      .single();

    if (!pod) return;

    // Create notification for captain
    if (pod.captain_id) {
      await supabase.from("notifications").insert({
        user_id: pod.captain_id,
        title: "👤 Member Left Discord",
        message: `${leftMember.user.tag} has left the server. ` +
          `Their pod membership is preserved - they'll be reassigned when they return.`,
        type: "pod_update",
      });
    }

    console.log(`Pod captain notified about ${leftMember.user.tag} leaving`);
  } catch (error) {
    console.error("Error notifying pod members:", error);
  }
}
