import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;

const PILLAR_ICONS: Record<string, string> = {
  faith: "✝️",
  discipline: "⚔️",
  brotherhood: "🤝",
  building: "🏗️",
  truth: "📖",
};

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your formation profile")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to view").setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const targetUser = interaction.options.getUser("user") || interaction.user;
    
    try {
      // Find the Discord account linked to this user
      const { data: discordAccount } = await supabase
        .from("discord_accounts")
        .select("user_id")
        .eq("discord_id", targetUser.id)
        .single();

      if (!discordAccount) {
        const embed = new EmbedBuilder()
          .setTitle(`${targetUser.username}'s FORMATION PROFILE`)
          .setThumbnail(targetUser.displayAvatarURL())
          .setDescription("This brother hasn't linked their account yet.\nUse **/link** to connect your Discord account.")
          .setColor(0xf59e0b);
        
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      // Fetch formation scores
      const { data: scores } = await supabase
        .from("formation_scores")
        .select("*")
        .eq("user_id", discordAccount.user_id)
        .single();

      // Fetch user's rank
      const { data: userRank } = await supabase
        .from("user_ranks")
        .select("rank_id, ranks(name)")
        .eq("user_id", discordAccount.user_id)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .single();

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", discordAccount.user_id)
        .single();

      const embed = new EmbedBuilder()
        .setTitle(`${profile?.display_name || targetUser.username}'s FORMATION PROFILE`)
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: "Rank", value: `**${(userRank as any)?.ranks?.name || "Initiate"}**`, inline: true },
          { name: "Overall Score", value: `**${scores?.overall_score || 0}**`, inline: true }
        )
        .addFields(
          { name: `${PILLAR_ICONS.faith} Faith`, value: String(scores?.faith_score || 0), inline: true },
          { name: `${PILLAR_ICONS.discipline} Discipline`, value: String(scores?.discipline_score || 0), inline: true },
          { name: `${PILLAR_ICONS.brotherhood} Brotherhood`, value: String(scores?.brotherhood_score || 0), inline: true },
          { name: `${PILLAR_ICONS.building} Building`, value: String(scores?.building_score || 0), inline: true },
          { name: `${PILLAR_ICONS.truth} Truth`, value: String(scores?.truth_score || 0), inline: true }
        )
        .setColor(ARGENT_SILVER)
        .setTimestamp()
        .setFooter({ text: "Execute. Build. Lead. Every day." });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Error fetching profile:", error);
      
      const embed = new EmbedBuilder()
        .setTitle(`${targetUser.username}'s FORMATION PROFILE`)
        .setThumbnail(targetUser.displayAvatarURL())
        .setDescription("Unable to fetch profile data. Please try again later.")
        .setColor(0xef4444);
      
      await interaction.editReply({ embeds: [embed] });
    }
  },
};
