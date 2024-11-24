const {Client, Interaction} = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player')


  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */

const player = useMainPlayer();

module.exports = async (client, interaction) => {
  try {
      if(!interaction.isAutocomplete()) return;
      if(interaction.commandName !== 'play') return;
      const value = interaction.options.getFocused();
      let results = await player.search(value, {
        requestedBy: interaction.user,
        searchEngine: QueryType.AUTO
      });

      if(results.tracks)
      {
        let options = results.tracks.map(track => { return {name: track.title, value: track.url }});
        interaction.respond(options.slice(0, 25)).catch(() => {});
      }

    } catch (err) {
        console.log(err);
    }
}