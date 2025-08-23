import {Client, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType, PermissionsBitField, MessageFlags, EmbedBuilder } from 'discord.js';

import { getI18n, formatMessage } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/nuke.json`, { with: { type: 'json' } });

export default  {
  name: 'nuke',
  description: 'nukes away an voice channel',
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    const words = (await getLocalization(interaction.locale)).default;
    const embed = new EmbedBuilder();

    let channel = interaction.options.get('channel')?.value;
    channel = channel ? await interaction.guild.channels.fetch(channel) : interaction.member?.voice?.channel; 

    if(!channel)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [ embed.setDescription(words.VCRequired) ],
      });
      return;
    } else if (channel && channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [ embed.setDescription(words.IsNotVC) ]
      });
      return;
    } else if (!channel.permissionsFor(interaction.guild.id).has([PermissionsBitField.Flags.ViewChannel]))
    {
      interaction.reply({
        flags: [ MessageFlags.Ephemeral ],
        embeds: [ embed.setDescription(words.OnlyPublicVC) ]
      });
      return;
    }

    await interaction.reply({
      embeds: [ embed.setDescription(formatMessage(words.Nuked, [channel])) ]
    });

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