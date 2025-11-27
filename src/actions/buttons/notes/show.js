import {
  Client,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import getNoteEmbeds from "../../../utils/components/getNoteEmbeds.js";
import getPaginator from "../../../utils/components/getPaginator.js";
import Enum from "../../../enums/noteContextEnum.js";

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

      let amount = 10;
      let countNotes = await Note.countDocuments(query);
      let notes = await Note.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * amount)
        .limit(amount);

      const embeds = await getNoteEmbeds(client, notes);
      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds,
        components: [
          getPaginator(
            {
              id: `notes;show;`,
              context: content.context,
            },
            countNotes,
            page,
            amount,
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
