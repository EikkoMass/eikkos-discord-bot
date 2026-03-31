import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";
import cache from "../../utils/cache/queue.js";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

import discord from "../../configs/discord.json" with { type: "json" };;

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
        context: discord.replies.edit,
      });
    }

    if (queue.node.isPlaying()) {
      return await reply.message.warning(interaction, words.NotPaused, {
        context: discord.replies.edit,
      });
    }

    queue.node.resume();

    cache.timeout.create(
      `${interaction.guild.id}`,
      queue.node.estimatedDuration - queue.node.streamTime,
    );

    await reply.message.success(interaction, words.Resumed, {
      context: discord.replies.edit,
      embed: {
        emoji: ":fire:",
      },
    });
  },
};
