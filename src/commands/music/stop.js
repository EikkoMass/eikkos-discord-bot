const { Client, Interaction } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'stop',
  description: 'stop the song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guild);

    if (queue.isPlaying()) 
      {
        queue.node.stop();
        await interaction.editReply("Stopped the song");
        return; 
      }

      await interaction.editReply("No song are playing right now!");
  }

}