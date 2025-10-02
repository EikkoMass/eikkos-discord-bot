import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import ms from "ms";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  name: "disconnect",
  description: "Disconnects the user from the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `disconnect`);
    const embed = new EmbedBuilder();
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
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [embed.setDescription(words.MissingPermissions)],
      });
      return;
    }

    if (!member?.voice?.channel) {
      interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [embed.setDescription(words.MustBeInVC)],
      });
      return;
    }

    const duration = ms(timer);
    const { default: prettyMs } = await import("pretty-ms");

    const formattedDuration = prettyMs(duration, { verbose: true });

    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        embed.setDescription(
          timer === INSTANT
            ? formatMessage(words.DisconnectingUser, [member.id])
            : formatMessage(words.DisconnectingUserWithDuration, [
                member.id,
                timer,
              ]),
        ),
      ],
    });

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
