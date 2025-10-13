import {
  PermissionFlagsBits,
  ActionRowBuilder,
  TextInputBuilder,
  ModalBuilder,
  InteractionContextType,
  ApplicationCommandType,
  TextInputStyle,
} from "discord.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "Reply Message",
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  permissionsRequired: [PermissionFlagsBits.ManageMessages],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `reply-message`);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel(words.WhatToReply)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const modal = new ModalBuilder()
      .setTitle(words.Title)
      .setCustomId(
        JSON.stringify({
          id: "reply;",
          messageId: interaction.targetMessage.id,
          hash: crypto.randomUUID(),
        }),
      )
      .setComponents(new ActionRowBuilder().addComponents(description));

    await interaction.showModal(modal);
  },
};
