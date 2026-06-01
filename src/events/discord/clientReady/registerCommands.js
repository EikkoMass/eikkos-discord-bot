import config from "../../../../config.json" with { type: "json" };
import actionTypes from "../../../configs/actionTypes.json" with { type: "json" };
import getLocal from "../../../utils/importers/getLocal.js";
import getApplicationCommands from "../../../utils/importers/getApplicationCommands.js";
import areCommandsDifferent from "../../../utils/validators/areCommandsDifferent.js";

const devOnlyLabel = " (dev only)";

export default async (client) => {
  try {
    const localCommands = await getLocal(actionTypes.commands, []);

    // Add testServer as a second parameter if you want to register only on a specific guild
    const applicationCommands = await getApplicationCommands(
      client,
      config.testServer,
    );

    for (const localCommand of localCommands) {
      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === localCommand.name,
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${localCommand.name}`);
          continue;
        }

        if (localCommand.devOnly) {
          localCommand.description += devOnlyLabel;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description: localCommand.description,
            options: localCommand.options,
          });

          console.log(`Edited command ${localCommand.name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `Skipping registering command "${localCommand.name}" as it's set to delete`,
          );
          continue;
        }

        if (localCommand.devOnly) {
          localCommand.description += devOnlyLabel;
        }

        await applicationCommands.create({
          name: localCommand.name,
          description: localCommand.description,
          options: localCommand.options,
        });

        console.log(`Registered command ${localCommand.name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
