import { readdirSync } from "fs";
import { join } from "path";
import type { BotClient } from "../index";

export async function loadCommands(client: BotClient) {
  const commandsPath = join(__dirname, "../commands");
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".ts")
  );

  console.log(`Loading ${commandFiles.length} commands...`);

  for (const file of commandFiles) {
    const command = await import(join(commandsPath, file));
    const commandData = command.default;

    if (commandData?.data?.name) {
      client.commands.set(commandData.data.name, commandData);
      console.log(`  ✓ Loaded command: ${commandData.data.name}`);
    }
  }

  console.log(`Successfully loaded ${client.commands.size} commands`);
}
