import config from "../../../config.json" with { type: "json" };
import getLocalContextMenus from "../../utils/getLocalContextMenus.js";
import { MessageFlags, EmbedBuilder, Client } from "discord.js";

let words;

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  if (!interaction.isContextMenuCommand()) return;

  words = await getLocalization(
    interaction.locale,
    `handlers/contextMenuCommands`,
  );

  try {
    const localCommands = await getLocalContextMenus();
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName,
    );

    if (!commandObject) return;

    if (
      checkDevOnly(interaction, commandObject) &&
      checkTestOnly(interaction, commandObject) &&
      checkUserPermissions(interaction, commandObject) &&
      checkBotPermissions(interaction, commandObject)
    ) {
      await commandObject.callback(client, interaction);
    }
  } catch (error) {
    console.log(formatMessage(words.Error, [error]));
  }
};

function checkDevOnly(interaction, commandObject) {
  return (
    !commandObject.devOnly ||
    config.devs.includes(interaction.member.id) ||
    reply(interaction, words.DevOnly)
  );
}

function checkTestOnly(interaction, commandObject) {
  return (
    !commandObject.testOnly ||
    interaction.guild.id === config.testServer ||
    reply(interaction, words.TestOnly)
  );
}

function checkUserPermissions(interaction, commandObject) {
  if (commandObject.permissionsRequired?.length) {
    for (const permission of commandObject.permissionsRequired) {
      if (!interaction.member.permissions.has(permission))
        return reply(interaction, words.MissingPermissions);
    }
  }

  return true;
}

function checkBotPermissions(interaction, commandObject) {
  if (commandObject.botPermissions?.length) {
    const bot = interaction.guild.members.me;

    for (const permission of commandObject.botPermissions) {
      if (!bot.permissions.has(permission))
        return reply(interaction, words.MissingBotPermissions);
    }
  }

  return true;
}

function reply(interaction, message) {
  interaction.reply({
    embeds: [new EmbedBuilder().setDescription(message)],
    flags: [MessageFlags.Ephemeral],
  });
}
