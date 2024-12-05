const {Client, Interaction, ApplicationCommandOptionType, ChannelType} = require('discord.js');

module.exports =  {
  name: 'drown',
  description: 'drown away an user in random voice channels',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {


    const targetMember = await interaction.guild.members.fetch(interaction.options.get('user')?.value);
    const attempts = interaction.options.get('attempts')?.value || 3;
    const secondsBetweenChanges = interaction.options.get('delay')?.value || 1;
    const ONE_SEC = 1000;

    if(targetMember.user.id === interaction.user.id)
    {
      interaction.reply({
        ephemeral: true,
        content: `The target user can't be yourself!`,
      });
      return;
    }

    if(targetMember.user.bot)
      {
        interaction.reply(`The drowned target couldn't be me, dumbass`);
        return;
      }

    if(!targetMember?.voice?.channel)
      {
        interaction.reply({
          ephemeral: true,
          content: `The target user needs at least to be in a voice channel!`,
        });
        return;
      }
    
      
    if(interaction.guild.channels.cache.size <= 1)
    {
      interaction.reply({
        ephemeral: true,
        content: `The guild needs to have at least 2 voice channels`,
      });
      return;
    }
    
    interaction.reply({
      ephemeral: true,
      content: `drowning ${targetMember.displayName || targetMember.nickname}, wait a sec!`,
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
