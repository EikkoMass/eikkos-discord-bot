const {ApplicationCommandOptionType, EmbedBuilder, Client, Interaction } = require('discord.js');
require('dotenv').config();

module.exports =  {
/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
  callback: async (client, interaction) => {
    const query = interaction.options?.get('query').value;

    const game = await fetch(`https://api.igdb.com/v4/games`, {
      method: 'POST',
      headers: {
        'Client-ID': process.env.IGDB_CLIENT_ID,
        'Authorization': `Bearer ${client.igdb.access_token}`
      },
      body: `fields *, artworks.*, game_engines.*, screenshots.*; where id = ${query};`
    });
    if(!game.ok)
    {
      interaction.reply('Game not found, try again later!');
      return;
    }

    const json = await game.json();
    console.log(json);

    // for(let i = 0; i < json[0].artworks.length; i++)
    // {
    //   console.log(`https://images.igdb.com/igdb/image/upload/t_logo_med/${json[0].cover}.png`)
    // }

    const embed = new EmbedBuilder()
      .setTitle(json[0].name)
      .setDescription(json[0].summary);
      //.setThumbnail(`https://images.igdb.com/igdb/image/upload/t_logo_med/${json[0].cover}.png`)

    interaction.reply({
      embeds: [embed]
    });
  },
  name: 'game',
  description: 'Command to search games // IGDB',
  options: [
    {
      name: 'query',
      description: 'the game name you want to search',
      type: ApplicationCommandOptionType.Number,
      required: true,
      autocomplete: true
    },
  ]
}