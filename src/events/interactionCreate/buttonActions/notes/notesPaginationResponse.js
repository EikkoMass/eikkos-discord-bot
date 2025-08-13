const { Client, Interaction, ButtonStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, MessageFlags } = require('discord.js');
const getNoteEmbeds = require('../../../../utils/getNoteEmbeds');

const Note = require('../../../../models/note');

const { getI18n } = require("../../../../utils/i18n");
const getLocalization = locale => require(`../../../../i18n/${getI18n(locale)}/notes`);

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('notes;')) return;
      if(!interaction.customId.includes('show;')) return;

      const words = getLocalization(interaction.locale);

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

      if(page !== minPage)
      {
        row.components.push(
          new ButtonBuilder()
            .setCustomId(`notes;show;${context};${lastPage}`)
            .setEmoji("<:before:1405034897004957761>")
            .setLabel(` `)
            .setStyle(ButtonStyle.Secondary)
        );
      }
  
      if(page !== maxPage)
      { 
        row.components.push(
          new ButtonBuilder()
            .setCustomId(`notes;show;${context};${nextPage}`)
            .setEmoji("<:next:1405034907264094259>")
            .setLabel(` `)
            .setStyle(ButtonStyle.Secondary)
        );
      }
      const message = await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [new EmbedBuilder().setDescription("Updated")]
      });
      
      interaction.message.edit({
        embeds: await getNoteEmbeds(client, notes),
        components: row.components?.length ? [row] : []
      });

      setTimeout(() => message.delete(), 3000);
  
    } catch (err) {
        console.log(err);
    }
}