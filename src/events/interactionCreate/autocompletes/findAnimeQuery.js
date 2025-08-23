import {Client} from 'discord.js';


const QUANTITY_OF_RESULTS = 6;

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default async (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'anime') return;
    if(interaction.options.getSubcommand() !== 'search') return;

    const req = await fetch(`https://api.jikan.moe/v4/anime?q=${interaction.options.getFocused()}&limit=${QUANTITY_OF_RESULTS}`, 
     { method: 'GET' }
    );

    const animes = await req.json();

    interaction.respond((animes?.data || []).map(anime => {return {name: anime.title, value: anime.mal_id}} )).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}