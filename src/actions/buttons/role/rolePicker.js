import { Client, MessageFlags, EmbedBuilder } from "discord.js";
import { getLocalization, formatMessage } from "../../../utils/i18n.js";

import reply from "../../../utils/core/replies.js";

export default {
  name: "role",

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    try {
      const words = await getLocalization(interaction.locale, `role`);

      await interaction.deferReply({
        flags: [MessageFlags.Ephemeral],
      });

      const content = JSON.parse(interaction.customId);
      const role = interaction.guild.roles.cache.get(content.roleId);

      if (!role) {
        return await reply.message.error(interaction, words.CouldntFindRole, {
          context: "editReply",
        });
      }

      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await reply.message.success(
          interaction,
          formatMessage(words.RoleNRemoved, [role]),
          {
            context: "editReply",
          },
        );
        return;
      }

      await interaction.member.roles.add(role);
      await reply.message.success(
        interaction,
        formatMessage(words.RoleNAdded, [role]),
        {
          context: "editReply",
        },
      );
    } catch (err) {
      console.log(err);
    }
  },
};
