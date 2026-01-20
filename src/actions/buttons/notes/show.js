import { Client } from "discord.js";
import getNoteEmbeds from "../../../utils/components/getNoteEmbeds.js";
import getPaginator from "../../../utils/components/getPaginator.js";
import Enum from "../../../enums/notes/contexts.js";
import discord from "../../../configs/discord.json" with { type: "json" };
import actions from "../../../configs/actions.json" with { type: "json" };

import Note from "../../../models/note.js";

export default {
  name: "notes",
  tags: ["show"],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      let content = JSON.parse(interaction.customId);
      let page = content.page;

      let query = {
        guildId: interaction.guild.id,
        type: content.context,
      };

      if (content.context === Enum.PRIVATE) {
        query.userId = interaction.user.id;
      }

      let countNotes = await Note.countDocuments(query);
      let notes = await Note.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * discord.embeds.max)
        .limit(discord.embeds.max);

      const embeds = await getNoteEmbeds(client, notes);
      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds,
        components: [
          getPaginator(
            {
              id: actions.notes.show,
              context: content.context,
            },
            countNotes,
            page,
            discord.embeds.max,
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
