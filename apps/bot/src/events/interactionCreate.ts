import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";
import type { BotClient } from "../index";

export default {
  name: "interactionCreate",
  once: false,
  async execute(client: BotClient, interaction: ChatInputCommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName) as any;

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: any) {
      // Check if error is "Unknown interaction" (interaction expired)
      if (error?.code === 10062) {
        console.error(`Command ${interaction.commandName}: Interaction expired (${error.code})`);
        return; // Don't try to respond - interaction is dead
      }
      
      console.error(`Command failed: ${interaction.commandName}:`, error);
      
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "⚠️ Command failed. Try again or contact an officer.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          await interaction.reply({
            content: "⚠️ Command failed. Try again or contact an officer.",
            flags: MessageFlags.Ephemeral,
          });
        }
      } catch (followUpError: any) {
        // If followUp fails, the interaction is likely expired
        if (followUpError?.code !== 10062) {
          console.error(`Failed to send error response:`, followUpError);
        }
      }
    }
  },
};
