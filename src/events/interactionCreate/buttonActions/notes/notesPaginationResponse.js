const { Client, Interaction, ButtonStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, MessageFlags } = require('discord.js');
const getNoteEmbeds = require('../../../../utils/getNoteEmbeds');

const Note = require('../../../../models/note');

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('notes;')) return;
      if(!interaction.customId.includes('show;')) return;

      let content = interaction.customId.replace('notes;show;', '');
      let splitContent = content.split(';');

      let context = splitContent[0];
      let page = Number.parseInt(splitContent[1]);

      let query = {
        guildId: interaction.guild.id,
        type: context,
      }

      if(context == 1)
      {
        query.userId = interaction.user.id;
      }

      let amount = 10;
      let countNotes = await Note.countDocuments(query);
      let notes = await Note.find(query).sort({ _id: -1 }).skip((page - 1) * amount).limit(amount);

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
          .setStyle(ButtonStyle.Secondary)
      );
      

      row.components.push(
          new ButtonBuilder()
            .setCustomId(crypto.randomUUID())
            .setDisabled(true)
            .setLabel(`${page}`)
            .setStyle(ButtonStyle.Primary)
      );
  
      row.components.push(
        new ButtonBuilder()
          .setCustomId(`notes;show;${context};${nextPage}`)
          .setDisabled(page === maxPage)
          .setEmoji("<:next:1405034907264094259>")
          .setLabel(` `)
          .setStyle(ButtonStyle.Secondary)
      );
      
      const embeds = await getNoteEmbeds(client, notes);

      await interaction.deferReply();
      await interaction.editReply({
        embeds,
        components: [row]
      });  
    } catch (err) {
        console.log(err);
    }
}