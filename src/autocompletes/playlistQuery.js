import { Client } from "discord.js";
import Playlist from "../models/playlist.js";

export default {
  name: "playlist",
  contexts: ["play"],
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const search = interaction.options.getFocused();

      var playlists = await Playlist.find({
        guildId: interaction.guild.id,
        name: { $regex: `.*${search}.*`, $options: "i" },
      }).limit(25);

      if (playlists) {
        let options = playlists.map((playlist) => {
          return { name: playlist.name, value: playlist.link };
        });
        interaction.respond(options.slice(0, 25)).catch(() => {});
      }
    } catch (err) {
      console.log(err);
    }
  },
};
