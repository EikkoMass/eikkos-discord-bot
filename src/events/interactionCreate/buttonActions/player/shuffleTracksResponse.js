const { Client, Interaction, MessageFlags, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('shuffle;')) return;

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ],
      }) ;
    
      const queue = useQueue(interaction.guild);
  
      queue.tracks.shuffle();
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(`:arrows_clockwise: Shuffled ${queue.tracks.size} tracks`)]
      });
  
    } catch (err) {
        console.log(err);
    }
}