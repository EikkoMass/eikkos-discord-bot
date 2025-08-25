import {Client, ApplicationCommandOptionType, EmbedBuilder, MessageFlags } from 'discord.js';

import { getLocalization } from "../../utils/i18n.js";

export default  {
  name: 'anime',
  description: 'Anime related commands',
  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'search':
        await search(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [new EmbedBuilder().setDescription(`Anime command not found!`)]
        });
        return;
    }
  },

  options: [
    {
      name: 'search',
      description: 'Find the anime you want',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'query',
          description: 'Anime search by name',
          type: ApplicationCommandOptionType.Integer,
          autocomplete: true,
          required: true,
        }
      ]
    }
  ]
}

/**
 *  @param {Client} client
 *  @param  interaction
*/
async function search(client, interaction) {

  const words = await getLocalization(interaction.locale, `anime`);

  let embed = new EmbedBuilder();
  const malId = interaction.options?.get('query').value;

  const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);

  if(!res.ok) {
    interaction.reply({
      embeds: [embed.setDescription(words.SearchFailed)]
    });
    return;
  }

  const anime = await res.json();

  const fields = [
    {name: words.Status, value: anime.data.status, inline: true  },
    {name: words.Type, value: anime.data.type, inline: true  },
    {name: " ", value: " " },
    {name: words.Studios, value: anime.data.studios.map(studio => studio.name).join(", "), inline: true },
    {name: words.Genres, value: anime.data.genres.map(genre => genre.name).join(", "), inline: true},
  ]

  embed
  .setTitle(anime.data.title)
  .setURL(anime.data.url)
  .setThumbnail(anime.data.images.jpg.large_image_url)
  .setFields(fields)
  .setDescription(anime.data.synopsis)

  interaction.reply({
    embeds:[embed]
  });
}
