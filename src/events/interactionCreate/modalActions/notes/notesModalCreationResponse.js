import {
  Client,
 
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  MessageFlags,
} from "discord.js";
import { getI18n } from "../../../../utils/i18n.js";
const getLocalization = async locale => await import(`../../../../i18n/${getI18n(locale)}/notes.json`, { with: { type: 'json' } });

import Note from "../../../../models/note.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  try {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId?.startsWith("notes;")) return;
    if (!interaction.customId.includes("add;")) return;

    const splittedId = interaction.customId
      .replace("notes;add;", "")
      .split(";");

    const context = splittedId[0] || 1;

    const title = interaction.fields?.getField("title")?.value;
    const description = interaction.fields?.getField("description").value;
    const img = interaction.fields?.getField("img")?.value;

    const words = (await getLocalization(interaction.locale)).default;

    const note = new Note({
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      type: context,
      creationDate: new Date(),
      img: img || null,
      title,
      text: description,
    });

    await note.save();

    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [new EmbedBuilder().setDescription(words.Added)],
    });
  } catch (err) {
    console.log(err);
  }
};
