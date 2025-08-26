import {ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from 'discord.js';

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const SUSPENSE_TIMEOUT_MS = 3000;
const quantity = {
  name: 'quantity',
  description: 'How many dices you want to roll?',
  type: ApplicationCommandOptionType.Integer
};


export default  {
  callback: async (client, interaction) => {

    switch(interaction.options.getSubcommand())
    {
      case 'custom':
        await rollCustom(client, interaction);
        break;
      case 'd4':
      case 'd6':
      case 'd8':
      case 'd10':
      case 'd12':
      case 'd20':
      case 'd100':
        await roll(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          content: `Roll command not found!`
        });
        return;
    }

  },
  name: 'roll',
  description: 'Get random numbers',
  options: [
    {
      name: 'custom',
      description: 'Sets a custom value to randomize',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'min',
          description: 'Min value to randomize 1 - n',
          type: ApplicationCommandOptionType.Integer,
        }, 
        {
          name: 'max',
          description: 'Max value to randomize n - 1.000.000',
          type: ApplicationCommandOptionType.Integer,
        }, 
        quantity
      ]
    },
    {
      name: 'd4',
      description: 'Rolls a D4 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    },       
    {
      name: 'd6',
      description: 'Rolls a D6 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    },  
    {
      name: 'd8',
      description: 'Rolls a D8 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    }, 
    {
      name: 'd10',
      description: 'Rolls a D10 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    }, 
    {
      name: 'd12',
      description: 'Rolls a D12 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    },  
    {
      name: 'd20',
      description: 'Rolls a D20 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    },  
    {
      name: 'd100',
      description: 'Rolls a D100 dice',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        quantity
      ]
    },  
  ]
}

async function rollCustom(client, interaction) {

  const words = await getLocalization(interaction.locale, `roll`);

  let min = interaction.options.get('min')?.value;
  let max = interaction.options.get('max')?.value;

  const quantity = interaction.options.get('quantity')?.value || 1;

  min = min ? Number.parseInt(min) : 1; 
  max = max ? Number.parseInt(max) : 1000000;
  
  await interaction.reply({
    embeds: [new EmbedBuilder().setDescription(words.CustomDiceReturns)]
  });

  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let result = null;

  for(let i = 0; i < quantity; i++)
  {
    let randomized = Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);

    if(!result)
    {
      result = `${randomized}`;
      continue;
    }

    result += ` / ${randomized}`;
  }


  setTimeout(()=> interaction.channel.send({
    embeds: [new EmbedBuilder().setDescription(`:game_die: ${result}`)]
  }), SUSPENSE_TIMEOUT_MS);
}

async function roll(client, interaction) {

  const words = await getLocalization(interaction.locale, `roll`);
  
  const sub = interaction.options.getSubcommand();
  const quantity = interaction.options.get('quantity')?.value || 1;
  let result = null;

  await interaction.reply({
    embeds: [new EmbedBuilder().setDescription(formatMessage(words.DDiceReturns, [sub]))]
  });
  const maxFloored = Number.parseInt(sub.replace(/[^\d]+/g, ''));


  for(let i = 0; i < quantity; i++)
    {
      let randomized = Math.floor(Math.random() * maxFloored + 1);
  
      if(!result)
      {
        result = `${randomized}`;
        continue;
      }
  
      result += ` / ${randomized}`;
    }

  setTimeout(()=> interaction.channel.send({
    embeds: [new EmbedBuilder().setDescription(`:game_die: ${result}`)]
  }), SUSPENSE_TIMEOUT_MS);
}