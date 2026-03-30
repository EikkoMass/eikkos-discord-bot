import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

import discord from "../../configs/discord.json";

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */

  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `ban`);

    const targetUserId = interaction.options.get("target").value;
    const reason =
      interaction.options.get("reason")?.value || words.NoReasonProvided;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await reply.message.error(interaction, words.UserNotExists, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await reply.message.info(interaction, words.CannotBanOwner, {
        context: discord.replies.edit,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await reply.message.info(interaction, words.BanHigherRole, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await reply.message.info(interaction, words.BanHigherRoleBot, {
        context: discord.replies.edit,
      });
      return;
    }

    //Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await reply.message.success(
        interaction,
        formatMessage(words.Banned, [targetUser, reason]),
        {
          context: discord.replies.edit,
          embed: {
            emoji: ":page_facing_up:",
          },
        },
      );
    } catch (e) {
      await reply.message.error(interaction, words.Error, {
        context: discord.replies.edit,
      });
      console.log(`There was an error when banning: ${e}`);
    }
  },

  name: "ban",
  description: "bans a member from this server.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target",
      description: "The user you want to ban.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason you want for ban1",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
