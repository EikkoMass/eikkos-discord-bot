import {
  Client,
  ApplicationCommandOptionType,
  ChannelType,
  PermissionFlagsBits,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "drown",
  description: "drown away an user in random voice channels",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `drown`);

    const targetMember = await interaction.guild.members.fetch(
      interaction.options.get("user")?.value,
    );
    const attempts = interaction.options.get("attempts")?.value || 3;
    const secondsBetweenChanges = interaction.options.get("delay")?.value;
    const ONE_SEC = 1000;

    if (secondsBetweenChanges < 0) {
      return await reply.message.error(interaction, words.DelayMustBePositive);
    }

    if (targetMember.user.id === interaction.user.id) {
      return await reply.message.error(interaction, words.CantBeSelf);
    }

    if (targetMember.user.bot) {
      return await reply.message.error(interaction, words.CantBeBot);
    }

    if (!targetMember?.voice?.channel) {
      return await reply.message.error(interaction, words.MustBeInVC);
    }

    if (interaction.guild.channels.cache.size <= 1) {
      return await reply.message.error(interaction, words.TwoVCRequired);
    }

    await reply.message.success(
      interaction,
      formatMessage(words.DrowningPleaseWait, [
        targetMember.displayName || targetMember.nickname,
      ]),
    );

    let finalChannel = targetMember.voice.channel;

    const voiceChannels = interaction.guild.channels.cache.filter(
      (channel) => channel.type === ChannelType.GuildVoice,
    );

    for (let i = 0; i < attempts; i++) {
      await targetMember.voice.setChannel(voiceChannels.random());
      await delay(secondsBetweenChanges * ONE_SEC);
    }

    await targetMember.voice.setChannel(finalChannel);
  },
  options: [
    {
      name: "user",
      description: "the user you want to drown",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "attempts",
      description:
        "How many attempts / voice channels you want to move the user",
      type: ApplicationCommandOptionType.Integer,
      min_value: 1,
    },
    {
      name: "delay",
      description:
        'Delay between each attempt (in seconds, you can also use floating numbers, like "1,5", "2,8", etc)',
      type: ApplicationCommandOptionType.Number,
    },
  ],
  botPermissions: [PermissionFlagsBits.MoveMembers],
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
