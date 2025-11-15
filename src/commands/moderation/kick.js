import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";

import reply from "../../utils/core/replies.js";

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided.";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await reply.message.error(
        interaction,
        "That user doesn't exist in this server.",
        {
          context: "editReply",
        },
      );
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await reply.message.info(
        interaction,
        "You can't kick that user because they're the server owner.",
        {
          context: "editReply",
        },
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await reply.message.info(
        interaction,
        "You can't kick that user because they have same / higher role than you.",
        {
          context: "editReply",
        },
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await reply.message.info(
        interaction,
        "I can't kick that user because they have the same / higher role than me.",
        {
          context: "editReply",
        },
      );
      return;
    }

    //Ban the targetUser
    try {
      await targetUser.kick(reason);

      await reply.message.success(
        interaction,
        `User ${targetUser} was kicked\nReason: ${reason}`,
        {
          context: "editReply",
        },
      );
    } catch (e) {
      console.log(`There was an error when kicking: ${e}`);

      await reply.message.error(
        interaction,
        `User ${targetUser} could not be kicked`,
        {
          context: "editReply",
        },
      );
    }
  },

  name: "kick",
  description: "kicks a member from this server..",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user you want to kick.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
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
