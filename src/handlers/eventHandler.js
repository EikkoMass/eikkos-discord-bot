import getAllFiles from "../utils/core/getAllFiles.js";
import path from "path";

async function addEventListeners(client) {
  const cache = {};

  const eventFolders = getAllFiles(
    path.join(import.meta.dirname, "..", "events", "discord"),
    true,
  );

  const IMPORT_BASE = path.join("..", "utils", "events");

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder, false, true);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder
      ?.replace(/\\/g, path.sep)
      .split(path.sep)
      .pop();

    let event = cache[eventName];

    if (!event) {
      try {
        event = (await import(path.join(IMPORT_BASE, `${eventName}.js`)))
          .default;
      } catch (error) {
        event = (await import(path.join(IMPORT_BASE, `default.js`))).default;
      }

      cache[eventName] = event;
    }

    client.on(eventName, event(client, eventFiles));
  }
}

export default addEventListeners;
