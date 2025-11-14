import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["stop"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `stop`);

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const queue = useQueue(interaction.guild);

      if (queue?.isPlaying()) {
        queue.node.stop();
        await reply.message.base(interaction, words.Stopped, {
          context: "editReply",
          embed: { emoji: ":rock:" },
        });
        return;
      }

      await reply.message.warning(interaction, words.NoSongPlaying, {
        context: "editReply",
      });
    } catch (err) {
      console.log(err);
    }
  },
};
