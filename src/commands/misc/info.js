const {ApplicationCommandOptionType, EmbedBuilder, Client, Interaction } = require('discord.js');
const info = require('../../../package.json');

module.exports =  {
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
          ephemeral: true,
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
 *  @param {Interaction} interaction
*/
async function all(client, interaction)
{
  const avatar = await fetch(`https://github.com/${info.repository.user}.png`);
  const bufferImg = await avatar.arrayBuffer();

  const infoFields = [
    {name: `Version`, value: info.version},
    {name: `License`, value: info.license},
    {name: `Author`, value: info.author},
    { name: 'Repository', value: `${info.repository.domain}/${info.repository.user}/${info.repository.name}` },
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
 *  @param {Interaction} interaction
*/
async function version(client, interaction)
{
  await interaction.reply({
    ephemeral: true,
    content: `Current version: ${info.version}`
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function author(client, interaction)
{
  await interaction.reply({
    ephemeral: true,
    content: `The author of the project is ${info.author}`
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function license(client, interaction)
{
  await interaction.reply({
    ephemeral: true,
    content: `Current license: ${info.license}`
  });
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function repository(client, interaction)
{
  await interaction.reply({
    ephemeral: true,
    content: `Project repository: ${info.repository.domain}/${info.repository.user}/${info.repository.name}`
  });
}
