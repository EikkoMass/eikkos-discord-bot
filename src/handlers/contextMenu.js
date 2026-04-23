import config from "../../config.json" with { type: "json" };
import actionTypes from "../configs/actionTypes.json" with { type: "json" };

import getLocal from "../utils/importers/getLocal.js";
import replies from "../utils/core/replies.js";

import { getLocalization, formatMessage } from "../utils/i18n.js";
import cache from "../utils/cache/commands/context-menu.js";

const handler = async (client, interaction) => {
  const words = await getLocalization(
    interaction.locale,
    `handlers/contextMenuCommands`,
  );

  try {
    let commandObject = cache.get(interaction.commandName);

    if (!commandObject) {
      if (cache.searched(interaction.commandName)) return;

      const localCommands = await getLocal(actionTypes.contextMenus);
      commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName,
      );

      cache.set(interaction.commandName, commandObject);
    }

    if (!commandObject) return;

    const checkers = [
      checkDevOnly,
      checkTestOnly,
      checkUserPermissions,
      checkBotPermissions,
    ];

    if (
      checkers.every(
        async (checker) => await checker(interaction, commandObject, words),
      )
    ) {
      await commandObject.callback(client, interaction);
    }
  } catch (error) {
    console.log(formatMessage(words.Error, [error]));
  }
};

export default handler;

async function checkDevOnly(interaction, commandObject) {
  return (
    !commandObject.devOnly ||
    config.devs.includes(interaction.member.id) ||
    (await replies.message.info(interaction, words.DevOnly))
  );
}

async function checkTestOnly(interaction, commandObject) {
  return (
    !commandObject.testOnly ||
    interaction.guild.id === config.testServer ||
    (await replies.message.info(interaction, words.TestOnly))
  );
}

async function checkUserPermissions(interaction, commandObject) {
  if (commandObject.permissionsRequired?.length) {
    for (const permission of commandObject.permissionsRequired) {
      if (!interaction.member.permissions.has(permission))
        return await replies.message.error(
          interaction,
          words.MissingPermissions,
        );
    }
  }

  return true;
}

async function checkBotPermissions(interaction, commandObject) {
  if (commandObject.botPermissions?.length) {
    const bot = interaction.guild.members.me;

    for (const permission of commandObject.botPermissions) {
      if (!bot.permissions.has(permission))
        return await replies.message.error(
          interaction,
          words.MissingBotPermissions,
        );
    }
  }

  return true;
}
