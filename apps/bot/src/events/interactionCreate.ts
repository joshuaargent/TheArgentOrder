import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import type { BotClient } from "../index";

export default {
  name: "interactionCreate",
  once: false,
  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Command failed: ${interaction.commandName}:`, error);
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "⚠️ Command failed. Try again or contact an officer.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "⚠️ Command failed. Try again or contact an officer.",
          ephemeral: true,
        });
      }
    }
  },
};
