const { Client, Interaction } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'leave',
  description: 'leave the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const queue = useQueue(interaction.guild);

    if (!queue)
    {
      await interaction.editReply("I'm not playing anything!");
      return; 
    }

    if (!queue.deleted) queue.delete();
    await interaction.editReply("Leaving the voice channel!");
  }

}