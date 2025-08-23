import {Client, ApplicationCommandOptionType, MessageFlags, EmbedBuilder } from 'discord.js';
import Joke from '../../models/joke.js';

import { getI18n, formatMessage } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/joke.json`, { with: { type: 'json' } });

export default  {
  name: 'joke',
  description: 'Talk the joke you registered.',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'for':
        use(client, interaction);
        break;
      case 'register':
        register(client, interaction)
        break;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          content: `Joke command not found!`
        });
        return;
    }
  },

  options: [
    {
      name: 'for',
      description: 'jokes around about...',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'Who will receive the joke?',
          type: ApplicationCommandOptionType.User,
          required: true
        }
      ]
    },
    {
      name: 'register',
      description: 'Register a joke about someone.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'Who will receive the joke?',
          type: ApplicationCommandOptionType.User,
          required: true
        },
        {
          name: 'message',
          description: 'What is the joke?',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ]
    }
  ]
}

async function use(client, interaction)
{
  const words = (await getLocalization(interaction.locale)).default;

  const embed = new EmbedBuilder();
  const targetUserId = interaction.options.get('user')?.value;

  let joke = await Joke.findOne({userId: interaction.member.id, guildId: interaction.guild.id, targetUserId});

  if(joke && joke.message)
  {
    interaction.reply({
      embeds: [ embed.setDescription(joke.message.replace('{user}', `<@${targetUserId}>`)) ]
    });
  } else {
    interaction.reply({
      embeds: [ embed.setDescription(words.NoJokeRegistered) ]
    });
  }
}

async function register(client, interaction)
{
  const words = (await getLocalization(interaction.locale)).default;
  const embed = new EmbedBuilder();
  const message = interaction.options.get('message')?.value;
  const targetUserId = interaction.options.get('user')?.value;

  
  let joke = await Joke.findOne({userId: interaction.member.id, guildId: interaction.guild.id, targetUserId});

  if(joke)
  {
    joke.message = message;
  } else {
    joke = new Joke({
      userId: interaction.member.id,
      guildId: interaction.guild.id,
      targetUserId: targetUserId,
      message
    });
  }
  
  await joke.save();

  interaction.reply({
    embeds: [ embed.setDescription(formatMessage(words.JokeCreated, [interaction.member.id, targetUserId]))], 
    flags: [ MessageFlags.Ephemeral ],
  });
}