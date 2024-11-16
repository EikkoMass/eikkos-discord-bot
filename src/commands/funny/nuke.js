const {Client, Interaction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, PermissionsBitField} = require('discord.js');

module.exports =  {
  name: 'nuke',
  description: 'nukes away an voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    let channel = interaction.options.get('channel')?.value;
    channel = channel ? await interaction.guild.channels.fetch(channel) : interaction.member?.voice?.channel; 

    if(!channel)
    {
      interaction.reply({
        ephemeral: true,
        content: `You need at least be in a voice channel!`,
      });
      return;
    } else if (channel && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)
    {
      interaction.reply({
        ephemeral: true,
        content: `The channel selected is not a voice channel!`,
      });
      return;
    } else if (!channel.permissionsFor(interaction.guild.id).has([PermissionsBitField.Flags.ViewChannel]))
    {
      interaction.reply({
        ephemeral: true,
        content: `I can only nuke public voice channels!`,
      });
      return;
    }

    await interaction.reply(`The ${channel} channel has been nuked away!`);

    channel.delete();
  },
  options: [
    {
      name: 'channel',
      description: 'the channel you want to be nuked',
      type: ApplicationCommandOptionType.Channel,
    }
  ],
  permissionsRequired: [
    PermissionFlagsBits.ManageChannels
  ],
  botPermissions: [
    PermissionFlagsBits.ManageChannels
  ]
}