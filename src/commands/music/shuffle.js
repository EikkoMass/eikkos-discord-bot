import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "shuffle",
  description: "shuffles the current playlist",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `shuffle`);
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const queue = useQueue(interaction.guild);

    if (!queue || queue.isEmpty()) {
      await reply.message.error(interaction, words.NoSong, {
        context: "editReply",
      });
      return;
    } else if (queue.tracks.size < 2) {
      await reply.message.warning(interaction, words.NotEnoughTracks, {
        context: "editReply",
      });
    }

    queue.tracks.shuffle();

    return await reply.message.success(
      interaction,
      formatMessage(words.Shuffled, [queue.tracks.size]),
      {
        context: "editReply",
        embed: {
          emoji: ":arrows_clockwise:",
        },
      },
    );
  },
};
