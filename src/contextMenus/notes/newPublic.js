import {
  Client,
  InteractionContextType,
  ApplicationCommandType,
  LabelBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} from "discord.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "New Public Note",
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
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const img = new TextInputBuilder()
      .setCustomId("img")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const modal = new ModalBuilder()
      .setCustomId(
        JSON.stringify({
          id: "notes;add;",
          context,
          hash: crypto.randomUUID(),
        }),
      )
      .setTitle(words.NewPublicNote)
      .setLabelComponents(
        new LabelBuilder({
          label: words.Title,
          component: title,
        }),
        new LabelBuilder({
          label: words.NoteInfo,
          component: description,
        }),
        new LabelBuilder({
          label: words.ImageLink,
          component: img,
        }),
      );

    await interaction.showModal(modal);
  },
};
