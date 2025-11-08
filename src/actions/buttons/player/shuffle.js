import { Client, MessageFlags, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["shuffle"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `shuffle`);

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const queue = useQueue(interaction.guild);

      if (!queue || queue.isEmpty()) {
        await reply.message.error(interaction, words.NoSong, {
          context: "editReply",
        });
        return;
      } else if (queue.tracks.size < 2) {
        await reply.message.error(interaction, words.NotEnoughTracks, {
          context: "editReply",
        });
        return;
      }

      queue.tracks.shuffle();

      await reply.message.base(
        interaction,
        formatMessage(words.Shuffled, [queue.tracks.size]),
        {
          context: "editReply",
          embed: {
            emoji: ":arrows_clockwise:",
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  },
};
