import type { BotClient } from "../index";

export default {
  name: "ready",
  once: true,
  async execute(client: BotClient) {
    console.log(`⚔️ The Argent Order Bot is online.`);
    console.log(`Logged in as: ${client.user?.tag}`);
    console.log(`Serving ${client.guilds.cache.size} server(s)`);
    console.log(`Execute. Build. Lead.`);
    
    // Set bot status - Catholic + Andrew Tate + Alex Hormozi messaging
    client.user?.setPresence({
      activities: [
        {
          name: "⚔️ Execute. Build. Lead.",
          type: 3, // WATCHING
        },
      ],
      status: "online",
    });
  },
};
