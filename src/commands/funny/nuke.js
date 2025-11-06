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
      await reply.errorMessage(interaction, words.VCRequired);
      return;
    } else if (
      channel &&
      channel.type !== ChannelType.GuildVoice &&
      channel.type !== ChannelType.GuildStageVoice
    ) {
      await reply.errorMessage(interaction, words.IsNotVC);
      return;
    } else if (
      !channel
        .permissionsFor(interaction.guild.id)
        .has([PermissionsBitField.Flags.ViewChannel])
    ) {
      await reply.errorMessage(interaction, words.OnlyPublicVC);
      return;
    }

    await reply.successMessage(
      interaction,
      formatMessage(words.Nuked, [channel]),
    );
    channel.delete();
  },
  options: [
    {
      name: "channel",
      description: "the channel you want to be nuked",
      type: ApplicationCommandOptionType.Channel,
      channel_types: [ChannelType.GuildVoice],
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
