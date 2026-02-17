import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["pause"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `pause`);

      const queue = useQueue(interaction.guild);

      if (!queue?.node) {
        await reply.message.error(interaction, words.NoQueue);
        return;
      }

      if (!queue.node.isPlaying()) {
        await reply.message.error(interaction, words.AlreadyPaused);
        return;
      }

      queue.node.pause();
      await interaction.deferUpdate();
    } catch (err) {
      console.log(err);
    }
  },
};
