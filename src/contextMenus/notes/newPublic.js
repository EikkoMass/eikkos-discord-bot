import {
  Client,
  InteractionContextType,
  ApplicationCommandType,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} from "discord.js";

import { getLocalization } from '../../utils/i18n.js';

export default {
  name: 'New Public Note',
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const context = 2;
    const words = await getLocalization(interaction.locale, `notes`);

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setLabel(words.Title)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setLabel(words.NoteInfo)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const img = new TextInputBuilder()
      .setCustomId("img")
      .setLabel(words.ImageLink)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const modal = new ModalBuilder()
      .setCustomId(`notes;add;${context};${crypto.randomUUID()}`)
      .setTitle(words.NewPublicNote)
      .setComponents(
        new ActionRowBuilder().addComponents(title),
        new ActionRowBuilder().addComponents(description),
        new ActionRowBuilder().addComponents(img),
      );

    await interaction.showModal(modal);
  }
}