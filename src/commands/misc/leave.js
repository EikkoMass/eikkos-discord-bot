const { Client, Interaction } = require('discord.js');

const { useQueue } = require('discord-player')

module.exports =  {
  name: 'leave',
  description: 'leave the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: (client, interaction) => {

    const queue = useQueue(interaction.guild);

    if (!queue)
    {
      interaction.reply({
        ephemeral: true,
        content: "I'm not playing anything!"
      });
      return; 
    }

    if (!queue.deleted) queue.delete();
    interaction.reply({
      ephemeral: true, 
      content: "Leaving the voice channel!"
    });
  }

}