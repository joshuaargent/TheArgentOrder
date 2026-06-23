import type { BotClient } from "../index";

export default {
  name: "ready",
  once: true,
  async execute(client: BotClient) {
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    console.log(`Serving ${client.guilds.cache.size} server(s)`);
    
    // Set bot status
    client.user?.setPresence({
      activities: [
        {
          name: "The Argent Order",
          type: 3, // WATCHING
        },
      ],
    });
  },
};
