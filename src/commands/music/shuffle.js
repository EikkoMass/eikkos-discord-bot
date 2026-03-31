import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

import discord from "../../configs/discord.json" with { type: "json" };;

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
      return await reply.message.error(interaction, words.NoSong, {
        context: discord.replies.edit,
      });
    } else if (queue.tracks.size < 2) {
      return await reply.message.warning(interaction, words.NotEnoughTracks, {
        context: discord.replies.edit,
      });
    }

    queue.tracks.shuffle();

    return await reply.message.success(
      interaction,
      formatMessage(words.Shuffled, [queue.tracks.size]),
      {
        context: discord.replies.edit,
        embed: {
          emoji: ":arrows_clockwise:",
        },
      },
    );
  },
};
