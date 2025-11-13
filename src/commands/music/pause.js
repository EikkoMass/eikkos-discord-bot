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
      await reply.message.error(interaction, words.NoQueue, {
        context: "editReply",
      });
      return;
    }

    if (queue.node.isPaused()) {
      await reply.message.warning(interaction, words.AlreadyPaused, {
        context: "editReply",
      });
      return;
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
