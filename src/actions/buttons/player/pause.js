import { Client, MessageFlags, EmbedBuilder } from "discord.js";
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

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const queue = useQueue(interaction.guild);

      if (!queue?.node) {
        await reply.message.error(interaction, words.NoQueue, {
          context: "editReply",
        });
        return;
      }

      if (!queue.node.isPlaying()) {
        await reply.message.error(interaction, words.AlreadyPaused, {
          context: "editReply",
        });
        return;
      }

      queue.node.pause();
      await reply.message.success(interaction, words.Paused, {
        context: "editReply",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
