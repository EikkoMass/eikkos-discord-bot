import path from "path";
import getAllFiles from "../core/getAllFiles.js";

const localCommands = [];

export default async (exceptions = []) => {
  if (localCommands.length > 0) return localCommands;

  const commandCategories = getAllFiles(
    path.join(import.meta.dirname, "..", "..", "commands"),
    true,
  );

  for (const commandCategory of commandCategories) {
    const commandFiles = getAllFiles(commandCategory);

    for (const commandFile of commandFiles) {
      const commandObject = (await import(commandFile)).default;

      if (exceptions.includes(commandObject.name)) continue;

      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
