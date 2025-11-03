import {
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
  Colors,
} from "discord.js";

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
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setTitle("Success")
            .setDescription(
              `Nickname of <@${member.user.id}> changed to *${nickname}*`,
            )
            .setColor(Colors.Green),
        ],
      });
    } catch (error) {
      console.log(error);
      return interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder()
            .setTitle("Error")
            .setDescription("An error occurred while changing the nickname.")
            .setColor(Colors.Red),
        ],
      });
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
