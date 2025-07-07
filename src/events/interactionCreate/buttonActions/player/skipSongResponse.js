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
      if(!interaction.customId.includes('skip;')) return;

      await interaction.deferReply({ 
        flags: [ MessageFlags.Ephemeral ], 
      });
    
      const queue = useQueue(interaction.guild);
  
      queue.node.skip();
      await interaction.editReply(`Skipped the song.`);
  
    } catch (err) {
        console.log(err);
    }
}