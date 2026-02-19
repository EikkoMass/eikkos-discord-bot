import { Client } from "discord.js";
import getPlaylistEmbeds from "../../../utils/components/getPlaylistEmbeds.js";
import getPaginator from "../../../utils/components/getPaginator.js";
import discord from "../../../configs/discord.json" with { type: "json" };
import actions from "../../../configs/actions.json" with { type: "json" };

import DirtyWord from "../../../models/dirtyword.js";

export default {
  name: "dirtyword",
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

      let count = await DirtyWord.countDocuments(query);
      let playlists = await DirtyWord.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * discord.embeds.max)
        .limit(discord.embeds.max);

      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds: await getPlaylistEmbeds(client, playlists),
        components: [
          getPaginator(
            {
              id: actions.dirtyword.list,
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
