const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');


module.exports =  {
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
          ephemeral: true,
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
 *  @param {Interaction} interaction
*/
async function search(client, interaction) {
  let embed = new EmbedBuilder();
  const malId = interaction.options?.get('query').value;

  const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);

  if(!res.ok) {
    interaction.reply({
      embeds: [embed.setDescription('Failed to search the requested anime!')]
    });
    return;
  }

  const anime = await res.json();

  const fields = [
    {name: 'Status', value: anime.data.status, inline: true  },
    {name: 'Type', value: anime.data.type, inline: true  },
    {name: " ", value: " " },
    {name: 'Studios', value: anime.data.studios.map(studio => studio.name).join(", "), inline: true },
    {name: 'Genres', value: anime.data.genres.map(genre => genre.name).join(", "), inline: true},
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
