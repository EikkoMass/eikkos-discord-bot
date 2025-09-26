import config from "../../../config.json" with { type: "json" };
import getLocalContextMenus from "../../utils/importers/getLocalContextMenus.js";
import getApplicationCommands from "../../utils/importers/getApplicationCommands.js";
import areContextMenusDifferent from "../../utils/validators/areContextMenusDifferent.js";
import { ApplicationCommandType } from "discord.js";

export default async (client) => {
  try {
    const localContexts = await getLocalContextMenus();
    // Add testServer as a second parameter if you want to register only on a specific guild
    const applicationCommands = await getApplicationCommands(
      client,
      config.testServer,
    );

    for (const localContext of localContexts) {
      const { name, contexts, type } = localContext;
      const existingContext = applicationCommands.cache.find(
        (cmd) =>
          cmd.name === name &&
          (cmd.type === ApplicationCommandType.Message ||
            cmd.type === ApplicationCommandType.User),
      );

      if (existingContext) {
        if (localContext.deleted) {
          await applicationCommands.delete(existingContext.id);
          console.log(`Deleted context menu ${name}`);
          continue;
        }

        if (areContextMenusDifferent(existingContext, localContext)) {
          await applicationCommands.edit(existingContext.id, {
            contexts,
          });

          console.log(`Edited context menu ${name}`);
        }
      } else {
        if (localContext.deleted) {
          console.log(
            `Skipping registering context menu "${name}" as it's set to delete`,
          );
          continue;
        }

        await applicationCommands.create({
          name,
          contexts,
          type: type || ApplicationCommandType.Message,
        });

        console.log(`Registered context menu ${name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
