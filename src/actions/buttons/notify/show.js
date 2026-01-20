import { Client } from "discord.js";
import getNotifyEmbeds from "../../../utils/components/getNotifyEmbeds.js";
import getPaginator from "../../../utils/components/getPaginator.js";
import discord from "../../../configs/discord.json" with { type: "json" };
import actions from "../../../configs/actions.json" with { type: "json" };

import Notify from "../../../models/notify.js";

export default {
  name: "notify",
  tags: ["show"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      let content = JSON.parse(interaction.customId);

      const query = {
        guildId: interaction.guild.id,
      };

      const count = await Notify.countDocuments(query);
      let page = content.page;

      const notify = await Notify.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * discord.embeds.max)
        .limit(discord.embeds.max);

      if (!notify || notify.length === 0) {
        return await replies.message.error(
          interaction,
          `No Notify register found!`,
        );
      }

      const embeds = await getNotifyEmbeds(client, notify);
      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds,
        components: [
          getPaginator(
            {
              id: actions.notify.show,
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
