import { Events, type Message, type TextChannel, type GuildTextBasedChannel } from "discord.js";
import { WELCOME_MESSAGES } from "../commands/setup";
import type { BotClient } from "../index";

const ARGENT_SILVER = 0xa1a1aa;

export default {
  name: Events.MessageCreate,
  once: false,

  async execute(client: BotClient, message: Message) {
    // Ignore bots
    if (message.author.bot) return;
    
    // Ignore non-guild text channels
    if (!message.inGuild() || !message.channel.isTextBased()) return;

    const channel = message.channel as GuildTextBasedChannel;
    const channelName = channel.name;
    
    // Check if this channel has a welcome message
    if (WELCOME_MESSAGES[channelName]) {
      await handleWelcomeChannel(client, message, channel);
    }
  },
};

async function handleWelcomeChannel(client: BotClient, message: Message, channel: GuildTextBasedChannel) {
  const channelName = channel.name;
  const welcomeInfo = WELCOME_MESSAGES[channelName];
  if (!welcomeInfo) return;

  try {
    // Fetch recent messages
    const messages = await channel.messages.fetch({ limit: 15 });
    
    // Find existing bot welcome message
    const existingBotMsg = messages.find(
      (m) => m.author.id === client.user?.id && 
             m.embeds.length > 0 && 
             m.embeds[0].title === welcomeInfo.title
    );

    // If bot message exists and is not at the very bottom, delete it
    // (user just posted, so bot message is no longer at bottom)
    if (existingBotMsg) {
      // Check if there's anything after the bot message
      const messagesArr = Array.from(messages.values());
      const botIndex = messagesArr.findIndex(m => m.id === existingBotMsg.id);
      const hasMessagesAfter = messagesArr.slice(botIndex + 1).some(m => !m.author.bot);
      
      if (hasMessagesAfter) {
        // Delete old bot message
        await existingBotMsg.delete();
      }
    }

    // Also check for any other bot messages (besides the welcome one)
    // and delete them to keep only welcome at bottom
    for (const msg of messages.values()) {
      if (msg.author.id === client.user?.id && msg.id !== existingBotMsg?.id) {
        await msg.delete().catch(() => {});
      }
    }

    // Wait a moment then post the welcome message at the bottom
    setTimeout(async () => {
      try {
        // Check again if our message is still the last one
        const freshMessages = await channel.messages.fetch({ limit: 5 });
        const lastMsg = freshMessages.first();
        
        if (lastMsg?.author.id !== client.user?.id || 
            !lastMsg.embeds.length ||
            lastMsg.embeds[0].title !== welcomeInfo.title) {
          
          // Post new welcome message
          const embed = {
            title: welcomeInfo.title,
            description: welcomeInfo.content,
            color: ARGENT_SILVER,
            timestamp: new Date().toISOString(),
          };
          
          await channel.send({ embeds: [embed] });
        }
      } catch (error) {
        console.error("Error posting welcome message:", error);
      }
    }, 500);

  } catch (error) {
    console.error("Error in welcome channel handler:", error);
  }
}
