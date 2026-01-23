import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "resume",
  description: "resume the paused playback",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const words = await getLocalization(interaction.locale, `resume`);

    const queue = useQueue(interaction.guild);

    if (!queue) {
      return await reply.message.error(interaction, words.QueueEmpty, {
        context: "editReply",
      });
    }

    if (queue.node.isPlaying()) {
      return await reply.message.warning(interaction, words.NotPaused, {
        context: "editReply",
      });
    }

    queue.node.resume();

    await reply.message.success(interaction, words.Resumed, {
      context: "editReply",
      embed: {
        emoji: ":fire:",
      },
    });
  },
};
