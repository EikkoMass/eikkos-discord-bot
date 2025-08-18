const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {

  name: 'question',
  description: 'Create a question with emoji voting',

  /** 
   * 
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const text = interaction.options.get('text').value;

    await interaction.deferReply();
    await interaction.deleteReply();

    const message = await interaction.channel.send({
        embeds: [
          new EmbedBuilder()
            .setFields([ {name: 'requester', value: `<@${interaction.member.id}>`}])
            .setTitle(text)
        ]
      });


    await message.react('👍');
    await message.react('👎');
  },

  options: [
    {
      name: 'text',
      description: 'What you want to ask?',
      type: ApplicationCommandOptionType.String, 
      required: true
    }
  ]
}