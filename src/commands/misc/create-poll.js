const {PollLayoutType, Client, Interaction } = require('discord.js');

module.exports =  {
  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    const message = await interaction.channel.send({
      poll: {
        question: { text: 'What\'s your favorite color?'},
        answers: [
          { text: 'Red', emoji: '🫀' },
          { text: 'Green', emoji: '🧩' },
          { text: 'Blue', emoji: '🫐' },
        ],
        allowMultiselect: false,
        duration: 2,
        layoutType: PollLayoutType.Default
      }
    });

    await message.pin();
  },
  name: 'create-poll',
  description: 'create a poll',
}