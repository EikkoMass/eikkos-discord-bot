import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

import { getLocalization } from "../../utils/i18n.js";
import reply from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */

  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `kick`);

    const targetUserId = interaction.options.get("target").value;
    const reason = interaction.options.get("reason")?.value || words.NoReason;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await reply.message.error(interaction, words.UserDontExist, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await reply.message.info(interaction, words.CantKickOwner, {
        context: discord.replies.edit,
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await reply.message.info(interaction, words.CantKickSameHigher, {
        context: discord.replies.edit,
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await reply.message.info(interaction, words.CantKickSameHigherBot, {
        context: discord.replies.edit,
      });
      return;
    }

    //Ban the targetUser
    try {
      await targetUser.kick(reason);

      await reply.message.success(interaction, words.Kicked, {
        context: discord.replies.edit,
      });
    } catch (e) {
      console.log(`There was an error when kicking: ${e}`);

      await reply.message.error(interaction, words.KickFailed, {
        context: discord.replies.edit,
      });
    }
  },

  name: "kick",
  description: "kicks a member from this server..",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target",
      description: "The user you want to kick.",
      required: true,
      type: ApplicationCommandOptionType.User,
    },
    {
      name: "reason",
      description: "The reason you want for kick.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
