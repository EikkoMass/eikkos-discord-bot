const {Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const Joke = require('../../models/joke');


module.exports =  {
  name: 'register-joke',
  description: 'Register a joke about someone.',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    const message = interaction.options.get('message')?.value;
    const targetUserId = interaction.options.get('user')?.value;

    
    let joke = await Joke.findOne({userId: interaction.member.id, guildId: interaction.guild.id, targetUserId});

    if(joke)
    {
      joke.message = message;
    } else {
      joke = new Joke({
        userId: interaction.member.id,
        guildId: interaction.guild.id,
        targetUserId: targetUserId,
        message
      });
    }
    
    await joke.save();

    interaction.reply({content: `Created a joke to <@${interaction.member.id}> from <@${targetUserId}>`, ephemeral: true});
  },

  options: [
    {
      name: 'user',
      description: 'Who will receive the joke?',
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'message',
      description: 'What is the joke?',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ]
}