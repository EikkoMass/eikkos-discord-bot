import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} from "discord.js";
import ms from "ms";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";

export default {
  name: "disconnect",
  description: "Disconnects the user from the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `disconnect`);
    const INSTANT = "0 seconds";

    let timer = interaction.options.get("timer")?.value || INSTANT;
    let member = interaction.options.get("user")?.value;

    if (member) {
      member = await interaction.guild.members.fetch(member);
    } else {
      member = interaction.member;
    }

    if (timer) {
      timer = timer
        .replaceAll(words.Seconds, "seconds")
        .replaceAll(words.Second, "second")

        .replaceAll(words.Minutes, "minutes")
        .replaceAll(words.Minute, "minute")

        .replaceAll(words.Hours, "hours")
        .replaceAll(words.Hour, "hour");
    }

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.MoveMembers) &&
      member.user.id !== interaction.user.id &&
      !member.user.bot
    ) {
      return await reply.message.error(interaction, words.MissingPermissions);
    }

    if (!member?.voice?.channel) {
      return await reply.message.error(interaction, words.MustBeInVC);
    }

    const duration = ms(timer);
    const { default: prettyMs } = await import("pretty-ms");

    const formattedDuration = prettyMs(duration, { verbose: true });

    await reply.message.error(
      interaction,
      timer === INSTANT
        ? formatMessage(words.DisconnectingUser, [member.id])
        : formatMessage(words.DisconnectingUserWithDuration, [
            member.id,
            timer,
          ]),
    );

    setTimeout(() => {
      member.voice.disconnect();
    }, duration);
  },

  options: [
    {
      name: "user",
      description: "the user you want to disconnect",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
    {
      name: "timer",
      description:
        "the time to disconnect the user (30 minutes , 1 hour , 1 day)",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};
