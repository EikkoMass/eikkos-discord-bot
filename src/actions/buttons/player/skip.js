import { Client, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import reply from "../../../utils/core/replies.js";

import { getLocalization } from "../../../utils/i18n.js";

export default {
  name: "player",
  tags: ["skip"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `skip`);

      const queue = useQueue(interaction.guild);

      if (!queue || queue.isEmpty()) {
        await reply.message.error(interaction, words.NoSong);
        return;
      }

      queue.node.skip();
      await interaction.deferUpdate();
    } catch (err) {
      console.log(err);
    }
  },
};
