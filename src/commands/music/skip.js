import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "skip",
  description: "skip the current song on the playlist",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `skip`);

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const queue = useQueue(interaction.guild);

    if (!queue || queue.isEmpty()) {
      await reply.message.error(interaction, words.NoSong, {
        context: "editReply",
      });
      return;
    }

    queue.node.skip();

    await reply.message.success(interaction, words.Skipped, {
      context: "editReply",
    });
  },
};
