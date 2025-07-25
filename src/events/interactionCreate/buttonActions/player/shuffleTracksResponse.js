const { Client, Interaction, MessageFlags, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

const { getI18n } = require("../../../../utils/i18n");
const getLocalization = locale => require(`../../../../i18n/${getI18n(locale)}/shuffle`);

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('shuffle;')) return;

      const words = getLocalization(interaction.locale);

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ],
      }) ;
    
      const queue = useQueue(interaction.guild);
  
      if(!queue || queue.isEmpty())
      {
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(words.NoSong)],
        });
        return;
      } else if (queue.tracks.size < 2)
      {
        await interaction.editReply({
          embeds: [new EmbedBuilder().setDescription(words.NotEnoughTracks)],
        });
      }

      queue.tracks.shuffle();

      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(`:arrows_clockwise: ${formatMessage(words.Shuffled, [queue.tracks.size])}`)],
      });
      
    } catch (err) {
        console.log(err);
    }
}