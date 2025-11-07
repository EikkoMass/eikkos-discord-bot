import getAllFiles from "../utils/core/getAllFiles.js";
import cache from "../utils/cache/event.js";
import path from "path";

export default async (client) => {
  const eventFolders = getAllFiles(
    path.join(import.meta.dirname, "..", "events"),
    true,
  );

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder, false, true);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder?.replace(/\\/g, "/").split("/").pop();

    let event = cache.get(eventName);

    if (!event) {
      try {
        event = (await import(`../utils/events/${eventName}.js`)).default;
      } catch (error) {
        event = (await import(`../utils/events/default.js`)).default;
      }

      cache.set(eventName, event);
    }

    client.on(eventName, event(client, eventFiles));
  }
};
