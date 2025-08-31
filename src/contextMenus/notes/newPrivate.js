import {
  Client,
  EmbedBuilder,
  MessageFlags,
  InteractionContextType,
  ApplicationCommandType,
  ActionRowBuilder,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
} from "discord.js";

import { getLocalization } from '../../utils/i18n.js';

import Note from "../../models/note.js";

const amount = 10;

export default {
  name: 'New Private Note',
  contexts: [InteractionContextType.Guild],
  type: ApplicationCommandType.Message,

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const context = 1;
    const words = await getLocalization(interaction.locale, `notes`);

    let query = {
      guildId: interaction.guild.id,
      type: context,
    };

    if (context == 1) {
      query.userId = interaction.user.id;
    }

    let countNotes = await Note.countDocuments(query);
  
    if (context === 1 && countNotes >= amount) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [new EmbedBuilder().setDescription(words.LimitExceeded)],
      });
      return;
    }

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
      .setTitle(words.NewNote)
      .setComponents(
        new ActionRowBuilder().addComponents(title),
        new ActionRowBuilder().addComponents(description),
        new ActionRowBuilder().addComponents(img),
      );

    await interaction.showModal(modal);
  }
}