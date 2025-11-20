import { Client } from "discord.js";
import { getLocalization } from "../../../utils/i18n.js";

import Note from "../../../models/note.js";
import { Types } from "mongoose";

import reply from "../../../utils/core/replies.js";

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
      let img = null;

      try {
        let imgObj = interaction.fields?.getUploadedFiles("img");

        if (imgObj) {
          const value = imgObj.entries()?.next()?.value?.[1];

          if (value?.contentType?.startsWith("image")) {
            img = value.url || null;
          }
        }
      } catch (err) {}

      const words = await getLocalization(interaction.locale, `notes`);

      let note = await Note.findOne({
        guildId: interaction.guild.id,
        userId: interaction.user.id,
        _id: new Types.ObjectId(`${content.code}`),
      });

      if (!note) {
        return await reply.message.error(interaction, words.NotFound);
      }

      note.title = title ?? note.title;
      note.text = description ?? note.text;
      note.img = img ?? note.img;

      await note.save();

      await reply.message.success(interaction, words.Edited);
    } catch (err) {
      console.log(err);
    }
  },
};
