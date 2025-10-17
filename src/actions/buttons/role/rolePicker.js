import { Client, MessageFlags, EmbedBuilder } from "discord.js";
import { getLocalization, formatMessage } from "../../../utils/i18n.js";

export default {
  name: "role",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `role`);
      const embed = new EmbedBuilder();

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const content = JSON.parse(interaction.customId);
      const role = interaction.guild.roles.cache.get(content.roleId);

      if (!role) {
        await interaction.editReply({
          embeds: [embed.setDescription(words.CouldntFindRole)],
        });
        return;
      }

      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply({
          embeds: [embed.setDescription(words.RoleNRemoved, [role])],
        });
        return;
      }

      await interaction.member.roles.add(role);
      await interaction.editReply({
        embeds: [embed.setDescription(words.RoleNAdded, [role])],
      });
    } catch (err) {
      console.log(err);
    }
  },
};
