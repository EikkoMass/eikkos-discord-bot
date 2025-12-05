import {
  Client,
  EmbedBuilder,
  MessageFlags,
  InteractionContextType,
  ApplicationCommandType,
  LabelBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  FileUploadBuilder,
} from "discord.js";

import { getLocalization } from "../../utils/i18n.js";
import Enum from "../../enums/noteContextEnum.js";

import Note from "../../models/note.js";

const amount = 10;

export default {
  name: "New Private Note",
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const context = Enum.PRIVATE;
    const words = await getLocalization(interaction.locale, `notes`);

    let query = {
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      type: context,
    };

    let countNotes = await Note.countDocuments(query);

    if (countNotes >= amount) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [new EmbedBuilder().setDescription(words.LimitExceeded)],
      });
      return;
    }

    const title = new TextInputBuilder()
      .setCustomId("title")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const description = new TextInputBuilder()
      .setCustomId("description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const img = new FileUploadBuilder()
      .setCustomId("img")
      .setMinValues(1)
      .setMaxValues(1)
      .setRequired(false);

    const modal = new ModalBuilder()
      .setCustomId(
        JSON.stringify({
          id: "notes;add;",
          context,
          hash: crypto.randomUUID(),
        }),
      )
      .setTitle(words.NewPrivateNote)
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
          label: words.Image,
          component: img,
        }),
      );

    await interaction.showModal(modal);
  },
};
