import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

import reply from "../../utils/core/replies.js";
import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "say",
  description: "Makes the bot say something",
  permissionsRequired: [PermissionFlagsBits.ManageMessages],
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `say`);
    const message = interaction.options.get("message").value;

    if (!message) {
      return await reply.message.error(interaction, words.ProvideMessage);
    }

    await interaction.deferReply();
    await interaction.deleteReply();

    interaction.channel.send(message);
  },

  options: [
    {
      name: "message",
      description: "Message to say",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};
