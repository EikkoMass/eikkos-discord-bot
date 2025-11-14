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

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const queue = useQueue(interaction.guild);

      if (!queue || queue.isEmpty()) {
        await reply.message.error(interaction, words.NoSong, {
          context: "editReply",
        });
        return;
      }

      queue.node.skip();
      await reply.message.success(interaction, words.Skipped, {
        context: "editReply",
        embed: {
          emoji: ":fast_forward:",
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
};
