import {
  Client,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import { getLocalization, formatMessage } from "../../utils/i18n.js";
import ms from "ms";

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const embed = new EmbedBuilder();
    const words = await getLocalization(interaction.locale, `timeout`);

    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || words.NoReasonProvided;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);

    if (!targetUser) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.UserNotExists)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.CantTimeoutBot)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.ValidTimeoutDuration)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.TimeoutLimit)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user;
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd;
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.SameHigherRole)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply({
        embeds: [embed.setDescription(words.SameHigherRoleBot)],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    //timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply({
          embeds: [
            embed.setDescription(
              formatMessage(words.Updated, [
                targetUser,
                prettyMs(msDuration, { verbose: true }),
              ]),
            ),
          ],
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply({
        embeds: [
          embed.setDescription(
            formatMessage(words.TimedOut, [
              targetUser,
              prettyMs(msDuration, { verbose: true }),
              reason,
            ]),
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });
    } catch (e) {
      console.log(`There was an error when timing out: ${e}`);
    }
  },

  name: "timeout",
  description: "Timeout a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout",
      type: ApplicationCommandOptionType.Mentionable,
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
