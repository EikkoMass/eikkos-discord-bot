import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
  PermissionsBitField,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "nuke",
  description: "nukes away an voice channel",
  options: [
    {
      name: "channel",
      description: "the channel you want to be nuked",
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `nuke`);

    let channel = interaction.options.get("channel")?.value;
    channel = channel
      ? await interaction.guild.channels.fetch(channel)
      : interaction.member?.voice?.channel;

    if (!channel) {
      return await reply.message.error(interaction, words.VCRequired);
    } else if (
      channel &&
      ![ChannelType.GuildVoice, ChannelType.GuildStageVoice].includes(
        channel.type,
      )
    ) {
      return await reply.message.error(interaction, words.IsNotVC);
    } else if (
      !channel
        .permissionsFor(interaction.guild.id)
        .has([PermissionsBitField.Flags.ViewChannel])
    ) {
      return await reply.message.error(interaction, words.OnlyPublicVC);
    }

    await reply.message.success(
      interaction,
      formatMessage(words.Nuked, [channel]),
    );
    channel.delete();
  },
};
