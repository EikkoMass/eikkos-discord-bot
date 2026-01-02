import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";
import { getLocalization } from "../../utils/i18n.js";

import reply from "../../utils/core/replies.js";

export default {
  name: "pause",
  description: "pause the song on the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `pause`);

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const queue = useQueue(interaction.guild);

    if (!queue?.node) {
      return await reply.message.error(interaction, words.NoQueue, {
        context: "editReply",
      });
    }

    if (queue.node.isPaused()) {
      return await reply.message.warning(interaction, words.AlreadyPaused, {
        context: "editReply",
      });
    }

    queue.node.pause();

    await reply.message.success(interaction, words.Paused, {
      context: "editReply",
      embed: {
        emoji: ":ice_cube:",
      },
    });
  },
};
