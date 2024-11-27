const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');
const MuteByGame = require('../../models/muteByGame');

module.exports =  {
  name: 'mute-by-game',
  description: 'play a song on the voice channel',

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const gameName = interaction.options.get('game').value;
    let activate = interaction.options.get('activate')?.value;

    if(activate === undefined) activate = true;

    let data = await MuteByGame.findOne({userId: interaction.user.id, guildId: interaction.guild.id, gameName: gameName});

    if(activate)
    {
      if(data)
      {
        interaction.reply({
          ephemeral: true,
          content: 'Already activated'
        });
        return;

      } else {
        data = new MuteByGame({
          userId: interaction.user.id,
          gameName,
          guildId: interaction.guild.id
        });

        data.save();

        interaction.reply({
          ephemeral: true,
          content: 'Mute command registered!'
        });
      }
    } else {
      if(data)
      {
        await MuteByGame.findOneAndDelete({userId: interaction.user.id, guildId: interaction.guild.id, gameName: gameName});

        interaction.reply({
          ephemeral: true,
          content: 'Mute command disabled!'
        });
        return;
      }
      
      interaction.reply({
        ephemeral: true,
        content: 'Already disabled'
      });
    }
  },

  options: [
    {
      name: 'game',
      description: 'game name you want to config',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    },
    {
      name: 'activate',
      description: 'if you want the option enabled or disabled',
      type: ApplicationCommandOptionType.Boolean,
    }
  ]
}