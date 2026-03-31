import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";
import cache from "../../utils/cache/queue.js";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

import discord from "../../configs/discord.json" with { type: "json" };;

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
      return await reply.message.error(interaction, words.NoSong, {
        context: discord.replies.edit,
      });
    }

    if (cache.get(CACHE_REF)) {
      await cache.get(CACHE_REF)();
      cache.resetOne(CACHE_REF);
    }

    queue.node.skip();

    await reply.message.success(interaction, words.Skipped, {
      context: discord.replies.edit,
    });
  },
};
