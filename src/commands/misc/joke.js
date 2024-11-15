const {Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Joke = require('../../models/joke');


module.exports =  {
  name: 'joke',
  description: 'Talk the joke you registered.',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    const targetUserId = interaction.options.get('user')?.value;

    let joke = await Joke.findOne({userId: interaction.member.id, guildId: interaction.guild.id, targetUserId});

    if(joke && joke.message)
    {
      interaction.reply(joke.message.replace('{user}', `<@${targetUserId}>`));
    } else {
      interaction.reply(`There's no joke registered to that user.`);
    }
  },

  options: [
    {
      name: 'user',
      description: 'Who will receive the joke?',
      type: ApplicationCommandOptionType.User,
      required: true
    }
  ]
}