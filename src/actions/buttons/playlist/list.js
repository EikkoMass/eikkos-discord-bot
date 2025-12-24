import { Client } from "discord.js";
import getPlaylistEmbeds from "../../../utils/components/getPlaylistEmbeds.js";
import getPaginator from "../../../utils/components/getPaginator.js";
import discord from "../../../configs/discord.json" with { type: "json" };

import Playlist from "../../../models/playlist.js";

export default {
  name: "playlist",
  tags: ["list"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      let content = JSON.parse(interaction.customId);

      let page = content.page;

      let query = {
        guildId: interaction.guild.id,
      };

      let count = await Playlist.countDocuments(query);
      let playlists = await Playlist.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * discord.embeds.max)
        .limit(discord.embeds.max);

      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds: await getPlaylistEmbeds(client, playlists),
        components: [
          getPaginator(
            {
              id: "playlist;list;",
            },
            count,
            page,
            discord.embeds.max,
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
