import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "stop",
  description: "stop the song on the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `stop`);

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const queue = useQueue(interaction.guild);

    if (queue.isPlaying()) {
      queue.node.stop();
      await reply.message.success(interaction, words.Stopped, {
        context: "editReply",
        embed: {
          emoji: ":rock:",
        },
      });
      return;
    }

    await reply.message.warning(interaction, words.NoSongPlaying, {
      context: "editReply",
    });
  },
};
