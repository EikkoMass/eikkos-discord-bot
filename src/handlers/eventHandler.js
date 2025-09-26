import getAllFiles from "../utils/getAllFiles.js";
import functionEvents from "../utils/importers/getFunctionEvents.js";
import path from "path";

export default (client) => {
  const eventFolders = getAllFiles(
    path.join(import.meta.dirname, "..", "events"),
    true,
  );

  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder, false, true);
    eventFiles.sort((a, b) => a > b);

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();
    client.on(
      eventName,
      (functionEvents[eventName] || functionEvents.default)(client, eventFiles),
    );
  }
};
