import { Client, ApplicationCommandOptionType } from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "volume",
  description: "individual command to manage voice channel volume",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guild);
    let amount = interaction.options.getNumber("amount", false);

    const words = await getLocalization(interaction.locale, `volume`);

    if (!amount) {
      return await reply.message.info(
        interaction,
        formatMessage(words.Current, [queue.node.volume]),
        {
          context: "editReply",
        },
      );
    }

    queue.node.setVolume(amount);

    await reply.message.success(
      interaction,
      formatMessage(words.Setted, [amount]),
      {
        context: "editReply",
      },
    );
  },

  options: [
    {
      name: "amount",
      description: "volume to play the song (0-100)",
      type: ApplicationCommandOptionType.Number,
      min_value: 0,
      max_value: 100,
      required: false,
    },
  ],
};
