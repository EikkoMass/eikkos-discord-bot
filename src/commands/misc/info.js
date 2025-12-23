import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Client,
  MessageFlags,
} from "discord.js";
import info from "../../../package.json" with { type: "json" };

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const OPTS = {
  all: {
    name: "all",
    description: "Show all information possible",
    type: ApplicationCommandOptionType.Subcommand,
  },
  version: {
    name: "version",
    description: "Current version of the bot",
    type: ApplicationCommandOptionType.Subcommand,
  },
  license: {
    name: "license",
    description: "Current license of the bot",
    type: ApplicationCommandOptionType.Subcommand,
  },
  author: {
    name: "author",
    description: "Author of the project",
    type: ApplicationCommandOptionType.Subcommand,
  },
  repository: {
    name: "repository",
    description: "Current repository of the bot",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.all.name:
        return await all(client, interaction);
      case OPTS.version.name:
        return await version(client, interaction);
      case OPTS.repository.name:
        return await repository(client, interaction);
      case OPTS.author.name:
        return await author(client, interaction);
      case OPTS.license.name:
        return await license(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Info command not found!`,
        );
    }
  },
  name: "info",
  description: "Show info about the bot.",
  options: [OPTS.all, OPTS.version, OPTS.repository, OPTS.author, OPTS.license],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function all(client, interaction) {
  const words = await getLocalization(interaction.locale, `info`);

  const avatar = await fetch(`https://github.com/${info.repository.user}.png`);
  const bufferImg = await avatar.arrayBuffer();

  const infoFields = [
    { name: words.Version, value: info.version },
    { name: words.License, value: info.license },
    { name: words.Author, value: info.author },
    {
      name: words.Repository,
      value: `${info.repository.domain}/${info.repository.user}/${info.repository.name}`,
    },
  ];

  const embed = new EmbedBuilder()
    .setTitle(info.name)
    .setDescription(info.description)
    .setColor("Random")
    .addFields(infoFields)
    .setThumbnail(`attachment://avatar.png`);

  await interaction.reply({
    embeds: [embed],
    files: [{ attachment: Buffer.from(bufferImg), name: `avatar.png` }],
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function version(client, interaction) {
  const words = await getLocalization(interaction.locale, `info`);

  await reply.message.info(
    interaction,
    formatMessage(words.CurrentVersion, [info.version]),
  );
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function author(client, interaction) {
  const words = await getLocalization(interaction.locale, `info`);

  await reply.message.info(
    interaction,
    formatMessage(words.ProjectOwner, [info.author]),
  );
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function license(client, interaction) {
  const words = await getLocalization(interaction.locale, `info`);

  await reply.message.info(
    interaction,
    formatMessage(words.CurrentLicense, [info.license]),
  );
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function repository(client, interaction) {
  const words = await getLocalization(interaction.locale, `info`);

  await reply.message.info(
    interaction,
    formatMessage(words.CurrentRepository, [
      `${info.repository.domain}/${info.repository.user}/${info.repository.name}`,
    ]),
  );
}
