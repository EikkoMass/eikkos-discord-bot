import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */

  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `ban`);

    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || words.NoReasonProvided;
    const embed = new EmbedBuilder();

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await reply.message.error(interaction, words.UserNotExists, {
        context: "editReply",
      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await reply.message.info(interaction, words.CannotBanOwner, {
        context: "editReply",
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await reply.message.info(interaction, words.BanHigherRole, {
        context: "editReply",
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await reply.message.info(interaction, words.BanHigherRoleBot, {
        context: "editReply",
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
          context: "editReply",
          embed: {
            emoji: ":page_facing_up:",
          },
        },
      );
    } catch (e) {
      await reply.message.error(interaction, words.Error, {
        context: "editReply",
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
      name: "target-user",
      description: "The user you want to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
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
