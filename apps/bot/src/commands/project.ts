import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { supabase } from "../index";

// Argent Order brand colors
const ARGENT_SILVER = 0xa1a1aa;

export default {
  data: new SlashCommandBuilder()
    .setName("project")
    .setDescription("🛠️ WORKSHOP project commands - track your builds")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("View your projects")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("update")
        .setDescription("Update a project")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("Project title")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("progress")
            .setDescription("What did you work on?")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "list":
        await listProjects(interaction);
        break;
      case "update":
        await updateProject(interaction);
        break;
    }
  },
};

async function listProjects(interaction: ChatInputCommandInteraction) {
  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with **/link**, or use OAuth invite to connect your Discord account first",
    });
    return;
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", discordAccount.user_id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (!projects || projects.length === 0) {
    await interaction.editReply({
      content: "You don't have any projects yet. Start building!",
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle("🏗️ YOUR PROJECTS")
    .setColor(ARGENT_SILVER);

  for (const project of projects) {
    embed.addFields({
      name: project.title,
      value: `${project.status} • ${project.description || "No description"}`,
      inline: false,
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

async function updateProject(interaction: ChatInputCommandInteraction) {
  const title = interaction.options.getString("title", true);
  const progress = interaction.options.getString("progress", true);

  const { data: discordAccount } = await supabase
    .from("discord_accounts")
    .select("user_id")
    .eq("discord_id", interaction.user.id)
    .single();

  if (!discordAccount) {
    await interaction.editReply({
      content: "Link your account with **/link**, or use OAuth invite to connect your Discord account first",
    });
    return;
  }

  // Find project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", discordAccount.user_id)
    .ilike("title", `%${title}%`)
    .single();

  if (!project) {
    await interaction.editReply({
      content: `Project "${title}" not found. Use /project list to see your projects.`,
    });
    return;
  }

  // Create project update
  await supabase.from("project_updates").insert({
    project_id: project.id,
    content: progress,
  });

  // Award formation points
  const points = 15;
  await supabase.from("formation_events").insert({
    user_id: discordAccount.user_id,
    pillar: "building",
    points: points,
    reason: `Project update: ${project.title}`,
    metadata: { project_id: project.id },
  });

  const embed = new EmbedBuilder()
    .setTitle("📝 PROJECT UPDATED!")
    .setDescription(`**${project.title}**`)
    .addFields(
      { name: "Progress", value: progress, inline: false },
      { name: "Points Earned", value: `**+${points}**`, inline: true }
    )
    .setColor(ARGENT_SILVER);

  await interaction.editReply({ embeds: [embed] });
}
