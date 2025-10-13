import { Client, MessageFlags } from "discord.js";

export default {
  name: "role",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const content = JSON.parse(interaction.customId);
      const role = interaction.guild.roles.cache.get(content.roleId);

      if (!role) {
        await interaction.editReply({ content: "I couldn't find that role!" });
        return;
      }

      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed.`);
        return;
      }

      await interaction.member.roles.add(role);
      await interaction.editReply(`The role ${role} has been added.`);
    } catch (err) {
      console.log(err);
    }
  },
};
