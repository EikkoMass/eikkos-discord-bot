import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../../utils/i18n.js";

import discord from "../../../configs/discord.json" with { type: "json" };

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
          context: discord.replies.edit,
        });
        return;
      } else if (queue.tracks.size < 2) {
        return await reply.message.error(interaction, words.NotEnoughTracks, {
          context: discord.replies.edit,
        });
      }

      queue.tracks.shuffle();

      await reply.message.base(
        interaction,
        formatMessage(words.Shuffled, [queue.tracks.size]),
        {
          context: discord.replies.edit,
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
