const {ApplicationCommandOptionType, Client, Interaction, EmbedBuilder, MessageFlags } = require('discord.js');
const Stream = require('../../models/stream');

const { getI18n,  formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/stream`);

module.exports =  {
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'register':
        await register(client, interaction);
        break;
      case 'remove':
        await remove(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [new EmbedBuilder().setDescription(`Stream command not found!`)]
        });
        return;
    }

  },
  name: 'stream',
  description: 'Manage links to bot stream',
  options: [
    {
      name: 'register',
      description: 'Register an new stream option',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'title',
          description: 'Title of the stream',
          type: ApplicationCommandOptionType.String,
          required: true
        }, 
        {
          name: 'link',
          description: 'Link that you want to stream',
          type: ApplicationCommandOptionType.String,
          required: true
        }, 
        {
          name: 'priority',
          description: 'How many dices you want to roll?',
          type: ApplicationCommandOptionType.Boolean
        }
      ]
    },
    {
      name: 'remove',
      description: 'Sets a custom value to randomize',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'link',
          description: 'Link that you want to stream',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ]
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function register(client, interaction)
{
  const words = getLocalization(interaction.locale);

  try {
    const title = interaction.options.get('title')?.value;
    const link = interaction.options.get('link')?.value;
    const priority = interaction.options.get('priority')?.value || false;
    const embed = new EmbedBuilder();

    let streamData = await Stream.findOne({
      link
    });

    if(streamData)
    {
      streamData.title = title;
      streamData.priority = priority;

      await interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.Edited)]
      });
      return;
    }

    streamData = new Stream({
      link,
      title,
      priority
    });

    await streamData.save();
    await interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      embeds: [embed.setDescription(words.Registered)]
    });
  } catch (e)
  {
    console.log(e);
  }
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function remove(client, interaction)
{
  const words = getLocalization(interaction.locale);
  
  const embed = new EmbedBuilder();
  const link = interaction.options.get('link')?.value;

  let result = await Stream.findOneAndDelete({ link });

  if(result)
  {
    await interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      embeds: [embed.setDescription(formatMessage(words.Removed,  [result.title]))]
    });
    return;
  }

  await interaction.reply({
    flags: [ MessageFlags.Ephemeral ],
    embeds: [embed.setDescription(words.NotFound)]
  });
}
