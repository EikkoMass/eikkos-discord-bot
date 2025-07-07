const { Client, Interaction, ApplicationCommandOptionType, ChannelType, EmbedBuilder, MessageFlags } = require('discord.js');

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/drown`);

module.exports =  {
  name: 'drown',
  description: 'drown away an user in random voice channels',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    
    const words = getLocalization(interaction.locale);

    const targetMember = await interaction.guild.members.fetch(interaction.options.get('user')?.value);
    const attempts = interaction.options.get('attempts')?.value || 3;
    const secondsBetweenChanges = interaction.options.get('delay')?.value;
    const embed = new EmbedBuilder();
    const ONE_SEC = 1000;
    
    if(secondsBetweenChanges < 0)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.DelayMustBePositive)],
      });
      return;
    }

    if(targetMember.user.id === interaction.user.id)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.CantBeSelf)],
      });
      return;
    }

    if(targetMember.user.bot)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.CantBeBot)]
      });
      return;
    }

    if(!targetMember?.voice?.channel)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.MustBeInVC)],
      });
      return;
    }
    
      
    if(interaction.guild.channels.cache.size <= 1)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [embed.setDescription(words.TwoVCRequired)],
      });
      return;
    }
    
    interaction.reply({
      flags: [ MessageFlags.Ephemeral ],
      embeds: [embed.setDescription(formatMessage(words.DrowningPleaseWait, [targetMember.displayName || targetMember.nickname]))],
    });

    let finalChannel = targetMember.voice.channel;

    const voiceChannels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice);

    for (let i = 0; i < attempts; i++) {
        await targetMember.voice.setChannel(voiceChannels.random())
        await delay(secondsBetweenChanges * ONE_SEC);
    }
  
    await targetMember.voice.setChannel(finalChannel);
  },
  options: [
    {
      name: 'user',
      description: 'the user you want to drown',
      type: ApplicationCommandOptionType.User,
      required: true
    },
    {
      name: 'attempts',
      description: 'How many attempts / voice channels you want to move the user',
      type: ApplicationCommandOptionType.Integer,
      min_value: 1
    },
    {
      name: 'delay',
      description: 'Delay between each attempt (in seconds, you can also use floating numbers, like "1,5", "2,8", etc)',
      type: ApplicationCommandOptionType.Number,
    }
  ],
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
};
