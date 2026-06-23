import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";
import { supabase } from "../index";

const GUILD_CATEGORY = "The Argent Order";
const CHANNEL_STRUCTURE = [
  { name: "🏠 Welcome", type: "text", parent: "welcome" },
  { name: "📜 Rules", type: "text", parent: "welcome" },
  { name: "📋 Announcements", type: "announcement", parent: "welcome" },
  { name: "🤝 Brotherhood", type: "category", children: [
    { name: "💬 General", type: "text" },
    { name: "🙏 Prayer Requests", type: "text" },
    { name: "🎯 Accountability", type: "text" },
  ]},
  { name: "🏋️ Formation", type: "category", children: [
    { name: "🙏 Prayer", type: "text" },
    { name: "📖 Scripture", type: "text" },
    { name: "⚔️ Discipline", type: "text" },
    { name: "💭 Examen", type: "text" },
  ]},
  { name: "🏗️ Builders Hall", type: "category", children: [
    { name: "💼 Projects", type: "text" },
    { name: "🚀 Launches", type: "text" },
    { name: "💡 Ideas", type: "text" },
  ]},
  { name: "🗳️ Pod Alpha", type: "category", children: [
    { name: "pod-alpha-general", type: "text" },
    { name: "📅 Meetings", type: "text" },
    { name: "🙏 Prayers", type: "text" },
  ]},
  { name: "🎓 Resources", type: "category", children: [
    { name: "📚 Library", type: "text" },
    { name: "🎥 Media", type: "text" },
  ]},
  { name: "🔒 Leadership", type: "category", children: [
    { name: "officers", type: "text" },
    { name: "strategy", type: "text" },
  ]},
];

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
        content: "This command can only be used in a server.",
      });
      return;
    }

    // Check if user has admin permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      await interaction.editReply({
        content: "Only administrators can run this command.",
      });
      return;
    }

    try {
      await interaction.editReply({
        content: "🔨 Setting up The Argent Order server structure...\n\nThis may take a moment.",
      });

      // Create categories and channels
      const createdStructure = await createServerStructure(guild);

      // Create roles
      const createdRoles = await createRoles(guild);

      // Store configuration in database
      await storeServerConfig(guild.id, createdStructure, createdRoles);

      const embed = new EmbedBuilder()
        .setTitle("✅ Server Setup Complete")
        .setDescription(
          `The Argent Order server structure has been created!\n\n` +
          `**Created:**\n` +
          `• ${createdStructure.categories.length} categories\n` +
          `• ${createdStructure.channels.length} channels\n` +
          `• ${createdRoles.length} roles\n\n` +
          `**Next Steps:**\n` +
          `1. Review the created channels and categories\n` +
          `2. Assign roles to members\n` +
          `3. Configure channel permissions as needed\n` +
          `4. Run /sync to link member accounts`
        )
        .setColor(0x00_ff_88)
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Setup failed:", error);
      await interaction.editReply({
        content: `❌ Setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    }
  },
};

async function createServerStructure(guild: any) {
  const createdCategories: any[] = [];
  const createdChannels: any[] = [];

  // Create main category
  const mainCategory = await guild.channels.create({
    name: GUILD_CATEGORY,
    type: ChannelType.GuildCategory,
  });
  createdCategories.push(mainCategory);

  // Create welcome category
  const welcomeCategory = await guild.channels.create({
    name: "👋 Welcome",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(welcomeCategory);

  // Create welcome channels
  const welcomeChannels = [
    { name: "welcome", type: ChannelType.GuildText },
    { name: "rules", type: ChannelType.GuildText },
  ];
  
  for (const ch of welcomeChannels) {
    const channel = await guild.channels.create({
      name: ch.name,
      type: ch.type,
      parent: welcomeCategory.id,
    });
    createdChannels.push(channel);
  }

  // Create announcements channel
  const announcementsChannel = await guild.channels.create({
    name: "announcements",
    type: ChannelType.GuildAnnouncement,
    parent: welcomeCategory.id,
  });
  createdChannels.push(announcementsChannel);

  // Create formation category with channels
  const formationCategory = await guild.channels.create({
    name: "🙏 Formation",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(formationCategory);

  const formationChannels = ["prayer", "scripture", "discipline", "examen", "check-in"];
  for (const ch of formationChannels) {
    const channel = await guild.channels.create({
      name: ch,
      type: ChannelType.GuildText,
      parent: formationCategory.id,
    });
    createdChannels.push(channel);
  }

  // Create brotherhood category
  const brotherhoodCategory = await guild.channels.create({
    name: "🤝 Brotherhood",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(brotherhoodCategory);

  const brotherhoodChannels = ["general", "prayer-requests", "accountability"];
  for (const ch of brotherhoodChannels) {
    const channel = await guild.channels.create({
      name: ch,
      type: ChannelType.GuildText,
      parent: brotherhoodCategory.id,
    });
    createdChannels.push(channel);
  }

  // Create builders hall category
  const buildersCategory = await guild.channels.create({
    name: "🏗️ Builders Hall",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(buildersCategory);

  const builderChannels = ["projects", "launches", "ideas"];
  for (const ch of builderChannels) {
    const channel = await guild.channels.create({
      name: ch,
      type: ChannelType.GuildText,
      parent: buildersCategory.id,
    });
    createdChannels.push(channel);
  }

  // Create resources category
  const resourcesCategory = await guild.channels.create({
    name: "📚 Resources",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(resourcesCategory);

  const resourceChannels = ["library", "media", "pod-meetings"];
  for (const ch of resourceChannels) {
    const channel = await guild.channels.create({
      name: ch,
      type: ChannelType.GuildText,
      parent: resourcesCategory.id,
    });
    createdChannels.push(channel);
  }

  // Create pod category template
  const podCategory = await guild.channels.create({
    name: "👥 Pods",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
  });
  createdCategories.push(podCategory);

  // Create pod General channel
  const podGeneral = await guild.channels.create({
    name: "pod-general",
    type: ChannelType.GuildText,
    parent: podCategory.id,
  });
  createdChannels.push(podGeneral);

  // Create leadership category
  const leadershipCategory = await guild.channels.create({
    name: "🎓 Leadership",
    type: ChannelType.GuildCategory,
    parent: mainCategory.id,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
    ],
  });
  createdCategories.push(leadershipCategory);

  const leadershipChannels = ["officers", "strategy"];
  for (const ch of leadershipChannels) {
    const channel = await guild.channels.create({
      name: ch,
      type: ChannelType.GuildText,
      parent: leadershipCategory.id,
    });
    createdChannels.push(channel);
  }

  return { categories: createdCategories, channels: createdChannels };
}

async function createRoles(guild: any) {
  const roles = [
    { name: "Visitor", color: "Grey", hoist: false },
    { name: "Initiate", color: "Blue", hoist: false },
    { name: "Brother", color: "Green", hoist: true },
    { name: "Veteran", color: "DarkGreen", hoist: true },
    { name: "Captain", color: "Orange", hoist: true },
    { name: "Officer", color: "Purple", hoist: true },
    { name: "Mentor", color: "Gold", hoist: true },
    { name: "Steward", color: "Red", hoist: true },
  ];

  const createdRoles = [];

  for (const role of roles) {
    const discordRole = await guild.roles.create({
      name: role.name,
      color: role.color as any,
      hoist: role.hoist,
    });
    createdRoles.push(discordRole);
  }

  // Create Pod Leader role
  const podLeaderRole = await guild.roles.create({
    name: "Pod Leader",
    color: "Cyan" as any,
    hoist: true,
  });
  createdRoles.push(podLeaderRole);

  return createdRoles;
}

async function storeServerConfig(
  guildId: string,
  structure: { categories: any[]; channels: any[] },
  roles: any[]
) {
  // Store server configuration in database
  const config = {
    guild_id: guildId,
    created_at: new Date().toISOString(),
    categories: structure.categories.map((c) => ({
      id: c.id,
      name: c.name,
    })),
    channels: structure.channels.map((c) => ({
      id: c.id,
      name: c.name,
    })),
    roles: roles.map((r) => ({
      id: r.id,
      name: r.name,
    })),
  };

  // Try to store in database
  try {
    await supabase.from("server_configs").upsert({
      guild_id: guildId,
      config: config,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Could not store server config in database:", error);
  }
}
