import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["resume"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `resume`);

      const queue = useQueue(interaction.guild);

      if (!queue) {
        return await reply.message.error(interaction, words.QueueEmpty);
      }

      if (queue.node.isPlaying()) {
        return await reply.message.error(interaction, words.AlreadyPlaying);
      }

      queue.node.resume();

      await interaction.deferUpdate();
    } catch (err) {
      console.log(err);
    }
  },
};
