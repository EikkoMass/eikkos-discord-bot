import { Client, MessageFlags } from "discord.js";

import { useQueue } from "discord-player";
import { getLocalization } from "../../utils/i18n.js";

import reply from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

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
        context: discord.replies.edit,
      });
    }

    if (queue.node.isPaused()) {
      return await reply.message.warning(interaction, words.AlreadyPaused, {
        context: discord.replies.edit,
      });
    }

    queue.node.pause();

    cache.cancel(`${interaction.guild.id}`);

    await reply.message.success(interaction, words.Paused, {
      context: discord.replies.edit,
      embed: {
        emoji: ":ice_cube:",
      },
    });
  },
};
