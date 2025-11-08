import { Client, MessageFlags, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["play"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `play`);

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const queue = useQueue(interaction.guild);

      if (queue.node.isPlaying()) {
        await reply.message.error(interaction, words.AlreadyPlaying, {
          context: "editReply",
        });
        return;
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
