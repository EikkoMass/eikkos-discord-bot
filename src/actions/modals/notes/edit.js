import { Client, EmbedBuilder, MessageFlags } from "discord.js";
import { getLocalization } from "../../../utils/i18n.js";

import Note from "../../../models/note.js";
import { Types } from "mongoose";

export default {
  name: "notes",
  tags: ["edit"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const content = JSON.parse(interaction.customId);

      const title = interaction.fields?.getField("title")?.value;
      const description = interaction.fields?.getField("description").value;
      const img = interaction.fields?.getField("img")?.value;

      const words = await getLocalization(interaction.locale, `notes`);

      let note = await Note.findOne({
        guildId: interaction.guild.id,
        userId: interaction.user.id,
        _id: new Types.ObjectId(`${content.code}`),
      });

      if (!note) {
        return interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [new EmbedBuilder().setDescription(words.NotFound)],
        });
      }

      note.title = title ?? note.title;
      note.text = description ?? note.text;
      note.img = img ?? note.img;

      await note.save();

      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [new EmbedBuilder().setDescription(words.Edited)],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
