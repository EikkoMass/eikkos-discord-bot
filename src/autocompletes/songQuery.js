import { Client } from "discord.js";
import { QueryType, useMainPlayer } from "discord-player";

const player = useMainPlayer();

export default {
  name: "play",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const value = interaction.options.getFocused();
      let results = await player
        .search(value, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});

      if (results?.tracks) {
        let options = results.tracks.map((track) => {
          return { name: track.title, value: track.url };
        });
        interaction.respond(options.slice(0, 25)).catch(() => {});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
