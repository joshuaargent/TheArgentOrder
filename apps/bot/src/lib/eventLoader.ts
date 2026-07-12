import { readdirSync } from "fs";
import { join } from "path";
import type { BotClient } from "../index";

export async function loadEvents(client: BotClient) {
  const eventsPath = join(__dirname, "../events");
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js")
  );

  console.log(`Loading ${eventFiles.length} events...`);

  for (const file of eventFiles) {
    const event = require(join(eventsPath, file));
    const eventData = event.default;

    if (eventData?.name) {
      const handler = eventData.execute.bind(null, client);
      
      if (eventData.once) {
        client.once(eventData.name, handler);
      } else {
        client.on(eventData.name, handler);
      }
      
      console.log(`  ✓ Loaded event: ${eventData.name}`);
    }
  }

  console.log(`Successfully loaded events`);
}
