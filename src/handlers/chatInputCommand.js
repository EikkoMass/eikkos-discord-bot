import actionTypes from "../configs/actionTypes.json" with { type: "json" };

import getLocal from "../utils/importers/getLocal.js";
import { getLocalization, formatMessage } from "../utils/i18n.js";
import cache from "../cache/commands/input.js";
import replies from "../utils/core/replies.js";

import config from "../../config.json" with { type: "json" };

const handler = async (client, interaction) => {
  const words = await getLocalization(
    interaction.locale,
    `handlers/chatInputCommands`,
  );

  try {
    let commandObject = cache.get(interaction.commandName);

    if (!commandObject) {
      if (cache.searched(interaction.commandName)) return;

      const localCommands = await getLocal(actionTypes.commands);
      commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName,
      );

      cache.set(interaction.commandName, commandObject);
    }

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

async function checkDevOnly(interaction, commandObject, words) {
  return (
    !commandObject.devOnly ||
    config.devs.includes(interaction.member.id) ||
    (await replies.message.info(interaction, words.DevOnly))
  );
}

async function checkTestOnly(interaction, commandObject, words) {
  return (
    !commandObject.testOnly ||
    interaction.guild.id === config.testServer ||
    (await replies.message.info(interaction, words.TestOnly))
  );
}

async function checkUserPermissions(interaction, commandObject, words) {
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

async function checkBotPermissions(interaction, commandObject, words) {
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
