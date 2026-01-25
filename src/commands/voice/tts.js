import { Client, ApplicationCommandOptionType, MessageFlags } from "discord.js";

import { useMainPlayer } from "discord-player";
import playerConfigs from "../../configs/player.json" with { type: "json" };

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";
import replies from "../../utils/core/replies.js";

export default {
  name: "tts",
  description: "Text-to-Speech command",
  devOnly: true,
  options: [
    {
      name: "prompt",
      description: "The text to convert to speech",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: [MessageFlags.Ephemeral],
    });

    const input = interaction.options.get("prompt").value;
    const player = useMainPlayer();

    if (!interaction.member?.voice?.channel) {
      return await replies.message.error(interaction, "Not in voice channel", {
        context: "editReply",
      });
    }

    player.play(interaction.member.voice.channel, `tts:${input}`, {
      nodeOptions: {
        metadata: {
          channel: interaction.channel,
          preferredLocale: interaction.locale,
        },
        leaveOnStop: false,
        pauseOnEmpty: true,
        leaveOnEmpty: false,
        leaveOnEnd: false,
      },
    });

    await interaction.deleteReply();
  },
};
