import { PermissionFlagsBits, ApplicationCommandOptionType } from "discord.js";

import reply from "../../utils/core/replies.js";

export default {
  name: "nickname",
  description: "Change the nickname of a user",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    let member = interaction.options?.get("user")?.value;
    let nickname = interaction.options.get("nickname").value;

    if (member) member = await interaction.guild.members.fetch(member);
    else member = interaction.member;

    try {
      await member.setNickname(nickname);
      return reply.message.success(
        interaction,
        `Nickname of <@${member.user.id}> changed to *${nickname}*`,
      );
    } catch (error) {
      console.log(error);
      return reply.message.error(
        interaction,
        `An error occurred while changing the nickname of <@${member.user.id}>`,
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
