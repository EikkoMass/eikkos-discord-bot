const { Client, Interaction } = require('discord.js');
const { useQueue } = require('discord-player');

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('pause;')) return;

      await interaction.deferReply({ ephemeral: true }) ;
    
      const queue = useQueue(interaction.guild);

      if(!queue.node.isPlaying()){
        await interaction.editReply(`The song are already paused`);
        return;
      }
  
      queue.node.pause();
      await interaction.editReply(`Paused the song.`);
  
    } catch (err) {
        console.log(err);
    }
}