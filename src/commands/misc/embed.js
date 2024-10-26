const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  callback: async (client, interaction) => {
    try {
      const quantity = interaction.options.get('quantity')?.value || 1;
      const title = interaction.options.get('title')?.value || "Embed title";
      const description = interaction.options.get('description')?.value || "This is an embed description";

      await interaction.reply({ embeds: myCustomEmbedList(quantity, { title, description }) });
    }
    catch (e) {
      console.log(e);
    }
  },
  name: 'embed',
  description: 'show an embedded content',
  options: [
    {
      name: 'quantity',
      description: 'quantity of required embeds',
      required: true,
      type: ApplicationCommandOptionType.Integer
    },
    {
      name: 'title',
      description: 'title of the embed',
      type: ApplicationCommandOptionType.String
    },
    {
      name: 'description',
      description: 'description of the embed',
      type: ApplicationCommandOptionType.String
    },
  ]
}


function myCustomEmbedList(quantity, dto) {
  const bannerURL = 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7sly.jpg';
  const imgURL = 'https://shared.cloudflare.steamstatic.com/store_item_assets/steam/apps/440/header.jpg?t=1724200484';

  const embeds = [];

  for (let i = 0; i < quantity; i++) {
    embeds.push(
      new EmbedBuilder()
        .setTitle(dto.title + (i + 1))
        .setDescription(dto.description)
        .setColor('Random')
        .addFields({ name: 'Field title', value: 'Some random value', inline: true }, { name: '2nd Field title', value: 'Some random value', inline: true })
        .setThumbnail(bannerURL)
        .setImage(imgURL)
    );
  }

  return embeds;
}

