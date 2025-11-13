import { Client } from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "leave",
  description: "leave the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `leave`);

    const queue = useQueue(interaction.guild);

    if (!queue || queue.deleted) {
      return await reply.message.error(interaction, words.NotInVC);
    }

    queue.delete();
    await reply.message.success(
      interaction,
      formatMessage(words.LeavingVC, [
        interaction.guild.members.me?.voice?.channel,
      ]),
    );
  },
};
