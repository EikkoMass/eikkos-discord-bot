import { ApplicationCommandOptionType, EmbedBuilder, Client, MessageFlags } from 'discord.js';
import info from '../../../package.json' with { type: 'json' };

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default  {
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'all':
        await all(client, interaction);
        return;
      case 'version':
        await version(client, interaction);
        return;
      case 'repository':
        await repository(client, interaction);
        return;
      case 'author':
        await author(client, interaction);
        return;
      case 'license':
        await license(client, interaction);
        return;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          content: `Info command not found!`
        });
        return;
    }

  },
  name: 'info',
  description: 'Show info about the bot.',
  options: [
    {
      name: 'all',
      description: 'Show all information possible',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'version',
      description: 'Current version of the bot',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'license',
      description: 'Current license of the bot',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'author',
      description: 'Author of the project',
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: 'repository',
      description: 'Current repository of the bot',
      type: ApplicationCommandOptionType.Subcommand
    }
  ]
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function all(client, interaction)
{
  const words = await getLocalization(interaction.locale, `info`);

  const avatar = await fetch(`https://github.com/${info.repository.user}.png`);
  const bufferImg = await avatar.arrayBuffer();

  const infoFields = [
    {name: words.Version, value: info.version},
    {name: words.License, value: info.license},
    {name: words.Author, value: info.author},
    { name: words.Repository, value: `${info.repository.domain}/${info.repository.user}/${info.repository.name}` },
  ];

  const embed = new EmbedBuilder()
  .setTitle(info.name)
  .setDescription(info.description)
  .setColor('Random')
  .addFields(infoFields)
  .setThumbnail(`attachment://avatar.png`);

  await interaction.reply({
    embeds: [embed],
    files: [{attachment: Buffer.from(bufferImg), name: `avatar.png`}]
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function version(client, interaction)
{
  const words = await getLocalization(interaction.locale, `info`);

  await interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [new EmbedBuilder().setDescription(formatMessage(words.CurrentVersion, [info.version]))]
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function author(client, interaction)
{
  const words = await getLocalization(interaction.locale, `info`);

  await interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [new EmbedBuilder().setDescription(formatMessage(words.ProjectOwner, [info.author]))]
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function license(client, interaction)
{
  const words = await getLocalization(interaction.locale, `info`);

  await interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [new EmbedBuilder().setDescription(formatMessage(words.CurrentLicense, [info.license]))]
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function repository(client, interaction)
{
    const words = await getLocalization(interaction.locale, `info`);

  await interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [new EmbedBuilder().setDescription(formatMessage(words.CurrentRepository, [`${info.repository.domain}/${info.repository.user}/${info.repository.name}`]))]
  });
}
