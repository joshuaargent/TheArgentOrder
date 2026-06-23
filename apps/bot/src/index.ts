import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import { loadCommands } from "./lib/commandLoader";
import { loadEvents } from "./lib/eventLoader";
import { createSupabaseClient } from "./lib/supabase";

dotenv.config();

export interface BotClient extends Client {
  commands: Collection<string, unknown>;
  supabase?: ReturnType<typeof createSupabaseClient>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
}) as BotClient;

async function main() {
  console.log("Starting The Argent Order Bot...");

  // Initialize Supabase
  client.supabase = createSupabaseClient();

  // Load commands and events
  client.commands = new Collection();
  await loadCommands(client);
  await loadEvents(client);

  // Login
  const token = process.env.DISCORD_TOKEN;
  if (!token) {
    console.error("DISCORD_TOKEN is not set in environment variables");
    process.exit(1);
  }

  await client.login(token);
  console.log("Bot is online!");
}

main().catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});
