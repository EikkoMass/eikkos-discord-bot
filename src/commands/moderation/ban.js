import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} from "discord.js";
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
      await interaction.editReply({
        embeds: [embed.setDescription(words.UserNotExists)],
      });
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.CannotBanOwner)],
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.BanHigherRole)],
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.BanHigherRoleBot)],
      });
      return;
    }

    //Ban the targetUser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            formatMessage(words.Banned, [targetUser, reason]),
          ),
        ],
      });
    } catch (e) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.Error)],
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
