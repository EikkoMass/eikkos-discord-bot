const {PollLayoutType, Client, Interaction } = require('discord.js');

module.exports =  {
  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const msgs = await interaction.channel.messages.fetchPinned()
    
    msgs.forEach(async msg => {
      if(msg.poll)
      {
        await msg.unpin();
        await msg.poll.end();
      }
    })
  },
  name: 'manage-poll',
  description: 'manage a poll',
}