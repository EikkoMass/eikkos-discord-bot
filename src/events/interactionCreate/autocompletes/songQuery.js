import {Client} from 'discord.js';
import { QueryType, useMainPlayer } from 'discord-player';

  /**
   *  @param {Client} client
   *  @param  interaction
  */

const player = useMainPlayer();

export default async (client, interaction) => {
  try {
      if(!interaction.isAutocomplete()) return;
      if(interaction.commandName !== 'play') return;
      const value = interaction.options.getFocused();
      let results = await player.search(value, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      }).catch(() => {});

      if(results?.tracks)
      {
        let options = results.tracks.map(track => { return {name: track.title, value: track.url }});
        interaction.respond(options.slice(0, 25)).catch(() => {});
      }

    } catch (err) {
        console.log(err);
    }
}