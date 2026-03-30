import { Client, ApplicationCommandOptionType, MessageFlags } from "discord.js";
import { useQueue } from "discord-player";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

import discord from "../../configs/discord.json" with { type: "json" };

export default {
  name: "repeat",
  description: "repeat the current songs on the queue",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `autorole`);

    const repeatOption = interaction.options.get("type")?.value;

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const queue = useQueue(interaction.guild);

    if (!queue || queue.isEmpty()) {
      await reply.message.error(interaction, words.NoSong, {
        context: discord.replies.edit,
      });
      return;
    }

    queue.setRepeatMode(repeatOption);

    await reply.message.success(interaction, words.CommandApplied, {
      context: discord.replies.edit,
      embed: {
        emoji: ":repeat:",
      },
    });
  },
  options: [
    {
      name: "type",
      description: "the type of repeat you want",
      type: ApplicationCommandOptionType.Integer,
      required: true,
      autocomplete: true,
    },
  ],
};
