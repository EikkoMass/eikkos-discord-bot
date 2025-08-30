import {
  Client,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { getLocalization } from "../../../utils/i18n.js";

import Note from "../../../models/note.js";

export default {
  
  name: 'notes',
  tags: ['add'],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const splittedId = interaction.customId
        .replace("notes;add;", "")
        .split(";");

      const context = splittedId[0] || 1;

      const title = interaction.fields?.getField("title")?.value;
      const description = interaction.fields?.getField("description").value;
      const img = interaction.fields?.getField("img")?.value;

      const words = await getLocalization(interaction.locale, `notes`);

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
  }
}