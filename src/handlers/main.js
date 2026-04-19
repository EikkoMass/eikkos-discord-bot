import getAllFiles from "../utils/core/getAllFiles.js";
import path from "path";

async function addEventListeners(client) {
  const eventFolders = getAllFiles(
    path.join(import.meta.dirname, "..", "events", "discord"),
    true,
  );

  const IMPORT_BASE = path.join("..", "utils", "bridges");

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder, false, true);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder
      ?.replace(/\\/g, path.sep)
      .split(path.sep)
      .pop();

    let bridge;

    try {
      bridge = (await import(path.join(IMPORT_BASE, `${eventName}.js`)))
        .default;
    } catch (error) {
      bridge = (await import(path.join(IMPORT_BASE, `default.js`))).default;
    }

    client.on(eventName, bridge(client, eventFiles));
  }
}

export default addEventListeners;
