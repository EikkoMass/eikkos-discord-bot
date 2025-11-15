import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import reply from "../../utils/core/replies.js";
import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  name: "nickname",
  description: "Change the nickname of a user",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `nickname`);

    let member = interaction.options?.get("user")?.value;
    let nickname = interaction.options.get("nickname").value;

    if (member) member = await interaction.guild.members.fetch(member);
    else member = interaction.member;

    try {
      await member.setNickname(nickname);
      return reply.message.success(
        interaction,
        formatMessage(words.Success, [member.user.id, nickname]),
      );
    } catch (error) {
      console.log(error);
      return reply.message.error(
        interaction,
        formatMessage(words.Error, [member.user.id]),
      );
    }
  },

  options: [
    {
      name: "nickname",
      description: "The new nickname",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "user",
      description: "The user to change the nickname",
      type: ApplicationCommandOptionType.User,
    },
  ],
  botPermissions: [PermissionFlagsBits.ChangeNickname],
};
