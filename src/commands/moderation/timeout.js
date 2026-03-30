import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
import ms from "ms";

import reply from "../../utils/core/replies.js";
import { getLocalization, formatMessage } from "../../utils/i18n.js";

import discord from "../../configs/discord.json" with { type: "json" };

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const embed = new EmbedBuilder();
    const words = await getLocalization(interaction.locale, `timeout`);

    const mentionable = interaction.options.get("target").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || words.NoReasonProvided;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);

    if (!targetUser) {
      await reply.message.error(interaction, words.UserNotExists, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUser.user.bot) {
      await reply.message.info(interaction, words.CantTimeoutBot, {
        context: discord.replies.edit,
      });
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await reply.message.error(interaction, words.ValidTimeoutDuration, {
        context: discord.replies.edit,
      });
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await reply.message.error(interaction, words.TimeoutLimit, {
        context: discord.replies.edit,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await reply.message.error(interaction, words.SameHigherRole, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await reply.message.error(interaction, words.SameHigherRoleBot, {
        context: discord.replies.edit,
      });
      return;
    }

    //timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await reply.message.success(
          interaction,
          formatMessage(words.Updated, [
            targetUser,
            prettyMs(msDuration, { verbose: true }),
          ]),
          { context: discord.replies.edit },
        );
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await reply.message.success(
        interaction,
        formatMessage(words.TimedOut, [
          targetUser,
          prettyMs(msDuration, { verbose: true }),
          reason,
        ]),
        { context: discord.replies.edit },
      );
    } catch (e) {
      console.log(`There was an error when timing out: ${e}`);
    }
  },

  name: "timeout",
  description: "Timeout a user.",
  options: [
    {
      name: "target",
      description: "The user you want to timeout",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30minute , 1hour , 1 day)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],
};
