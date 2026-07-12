import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { loadCommands } from "./lib/commandLoader";
import { loadEvents } from "./lib/eventLoader";
import { createSupabaseClient } from "./lib/supabase";

dotenv.config();

// Create Supabase client as a module-level export for commands
export const supabase = createSupabaseClient();

export interface BotClient extends Client {
  commands: Collection<string, unknown>;
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
}) as BotClient;

async function registerCommands() {
  const commands = [];
  const commandFiles = client.commands;

  for (const [name, command] of commandFiles) {
    const cmd = command as { data: { toJSON: () => unknown } };
    commands.push(cmd.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
  const clientId = process.env.DISCORD_CLIENT_ID!;

  try {
    console.log(`Registering ${commands.length} slash commands...`);
    
    // Register globally
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log("Successfully registered global slash commands!");

    // Also register for the guild if GUILD_ID is set
    if (process.env.DISCORD_GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(clientId, process.env.DISCORD_GUILD_ID),
        { body: commands }
      );
      console.log("Successfully registered guild slash commands!");
    }
  } catch (error) {
    console.error("Failed to register commands:", error);
  }
}

async function main() {
  console.log("Starting The Argent Order Bot...");

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
  
  // Register slash commands after login
  await registerCommands();
  
  console.log("Bot is online!");
}

main().catch((error) => {
  console.error("Failed to start bot:", error);
  process.exit(1);
});
