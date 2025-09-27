import {
  Client,
  ButtonStyle,
  ActionRowBuilder,
  ButtonBuilder,
} from "discord.js";
import getNoteEmbeds from "../../../utils/components/getNoteEmbeds.js";

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
      let content = interaction.customId.replace("notes;show;", "");
      let splitContent = content.split(";");

      let context = splitContent[0];
      let page = Number.parseInt(splitContent[1]);

      let query = {
        guildId: interaction.guild.id,
        type: context,
      };

      if (context == 1) {
        query.userId = interaction.user.id;
      }

      let amount = 10;
      let countNotes = await Note.countDocuments(query);
      let notes = await Note.find(query)
        .sort({ _id: -1 })
        .skip((page - 1) * amount)
        .limit(amount);

      const row = new ActionRowBuilder();

      const minPage = 1;
      const maxPage = Math.ceil(countNotes / amount);
      const lastPage = Math.max(minPage, page - 1);
      const nextPage = Math.min(maxPage, page + 1);

      row.components.push(
        new ButtonBuilder()
          .setCustomId(`notes;show;${context};${lastPage}`)
          .setDisabled(page === minPage)
          .setEmoji("<:before:1405034897004957761>")
          .setLabel(` `)
          .setStyle(ButtonStyle.Secondary),
      );

      row.components.push(
        new ButtonBuilder()
          .setCustomId(crypto.randomUUID())
          .setDisabled(true)
          .setLabel(`${page}`)
          .setStyle(ButtonStyle.Primary),
      );

      row.components.push(
        new ButtonBuilder()
          .setCustomId(`notes;show;${context};${nextPage}`)
          .setDisabled(page === maxPage)
          .setEmoji("<:next:1405034907264094259>")
          .setLabel(` `)
          .setStyle(ButtonStyle.Secondary),
      );

      const embeds = await getNoteEmbeds(client, notes);
      await interaction.deferUpdate();
      await interaction.message.edit({
        embeds,
        components: [row],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
