import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

import { useQueue } from "discord-player";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  name: "volume",
  description: "individual command to manage voice channel volume",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const embed = new EmbedBuilder();
    const queue = useQueue(interaction.guild);
    let amount = interaction.options.getNumber("amount", false);

    const words = await getLocalization(interaction.locale, `volume`);

    if (!amount) {
      await interaction.editReply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          embed.setDescription(
            formatMessage(words.Current, [queue.node.volume]),
          ),
        ],
      });
      return;
    }

    queue.node.setVolume(amount);

    await interaction.editReply({
      embeds: [embed.setDescription(formatMessage(words.Setted, [amount]))],
    });
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
