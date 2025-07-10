const {Client, Interaction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, PermissionsBitField, MessageFlags } = require('discord.js');

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/nuke`);

module.exports =  {
  name: 'nuke',
  description: 'nukes away an voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const words = getLocalization(interaction.locale);

    let channel = interaction.options.get('channel')?.value;
    channel = channel ? await interaction.guild.channels.fetch(channel) : interaction.member?.voice?.channel; 

    if(!channel)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: words.VCRequired,
      });
      return;
    } else if (channel && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: words.IsNotVC,
      });
      return;
    } else if (!channel.permissionsFor(interaction.guild.id).has([PermissionsBitField.Flags.ViewChannel]))
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        content: words.OnlyPublicVC,
      });
      return;
    }

    await interaction.reply(formatMessage(words.Nuked, [channel]));

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