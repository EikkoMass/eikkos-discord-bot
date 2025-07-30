const { Client, Interaction, ApplicationCommandOptionType, MessageFlags, EmbedBuilder } = require('discord.js');
const MuteByGame = require('../../models/muteByGame');

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/mute-by-game`);

module.exports =  {
  name: 'mute-by-game',
  description: 'play a song on the voice channel',

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const embed = new EmbedBuilder();
    const words = getLocalization(interaction.locale);

    const gameName = interaction.options.get('game').value;
    let activate = interaction.options.get('activate')?.value;

    if(activate === undefined) activate = true;

    let data = await MuteByGame.findOne({userId: interaction.user.id, guildId: interaction.guild.id, gameName: gameName});

    if(activate)
    {
      if(data)
      {
        interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [ embed.setDescription(words.AlreadyActive) ]
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
          flags: [ MessageFlags.Ephemeral ],
          embeds: [ embed.setDescription(words.Registered) ]
        });
      }
    } else {
      if(data)
      {
        await MuteByGame.findOneAndDelete({userId: interaction.user.id, guildId: interaction.guild.id, gameName: gameName});

        interaction.reply({
          flags: [ MessageFlags.Ephemeral ],
          embeds: [ embed.setDescription(words.Disabled) ]
        });
        return;
      }
      
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [ embed.setDescription(words.AlreadyDisabled) ]
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