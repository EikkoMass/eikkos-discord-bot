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

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      if (!queue) {
        return await reply.message.error(interaction, words.QueueEmpty, {
          context: "editReply",
        });
      }

      if (queue.node.isPlaying()) {
        return await reply.message.error(interaction, words.AlreadyPlaying, {
          context: "editReply",
        });
      }

      queue.node.resume();

      await reply.message.success(interaction, words.Resumed, {
        context: "editReply",
      });

      return;
    } catch (err) {
      console.log(err);
    }
  },
};
