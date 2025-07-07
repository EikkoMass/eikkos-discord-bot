const { Client, Interaction, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player');

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
module.exports = async (client, interaction) => {
  try {
      if(!interaction.isButton()) return;
      if(!interaction.customId?.startsWith('player;')) return;
      if(!interaction.customId.includes('play;')) return;

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ], 
      }) ;
    
      const queue = useQueue(interaction.guild);

      if(queue.node.isPlaying()){
        await interaction.editReply(`The song are already playing`);
        return;
      }
  
      queue.node.resume();
      await interaction.editReply(`Resumed the song.`);
  
    } catch (err) {
        console.log(err);
    }
}