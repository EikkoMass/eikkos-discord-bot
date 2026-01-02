import { Client } from "discord.js";
import playerConfigs from "../../configs/player.json" with { type: "json" };
import { useMainPlayer } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "join",
  description: "enter in the voice channel.",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `join`);

    const channel = {
      requester: interaction.member?.voice?.channel,
      bot: interaction.guild.members.me?.voice?.channel,
    };

    if (!channel.requester) {
      return await reply.message.error(interaction, words.VCRequired);
    }

    if (channel?.bot?.id === channel?.requester?.id) {
      return await reply.message.error(
        interaction,
        formatMessage(words.AlreadyInNVC, [channel.bot.toString()]),
      );
    }

    if (channel.bot) {
      return await reply.message.error(interaction, words.AlreadyInVC);
    }

    try {
      const queue = useMainPlayer().queues.create(interaction.guild.id, {
        ...playerConfigs,
      });

      await queue.connect(channel.requester);

      return await reply.message.success(
        interaction,
        formatMessage(words.JoinedVC, [channel.requester.toString()]),
      );
    } catch (error) {
      console.error(error);

      return await reply.message.error(interaction, words.ErrorJoiningVC);
    }
  },
};
