import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
} from "discord.js";
import AutoRole from "../../models/autorole.js";

import reply from "../../utils/core/replies.js";

import { getLocalization } from "../../utils/i18n.js";

const OPTS = {
  configure: {
    name: "configure",
    description: "Configure your auto-role for this server.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "role",
        description: "The role you want users to get on join.",
        type: ApplicationCommandOptionType.Role,
        required: true,
      },
    ],
  },
  disable: {
    name: "disable",
    description: "Disable auto-role in this server.",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  name: "autorole",
  description: "Manage the server auto-role",
  options: [OPTS.configure, OPTS.disable],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],

  /**
   *  @param {Client} client
   *  @param interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.configure.name:
        return await configure(client, interaction);
      case OPTS.disable.name:
        return await disable(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Auto role command not found!`,
        );
    }
  },
};

async function configure(client, interaction) {
  const words = await getLocalization(interaction.locale, "auto-role");

  if (!interaction.inGuild()) {
    return reply.message.error(interaction, words.OnlyInsideServer);
  }

  const targetRoleId = interaction.options.get("role").value;

  try {
    let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

    if (autoRole) {
      if (autoRole.roleId === targetRoleId) {
        await reply.message.info(interaction, words.AlreadyConfigured);
        return;
      }

      autoRole.roleId = targetRoleId;
    } else {
      autoRole = new AutoRole({
        guildId: interaction.guildId,
        roleId: targetRoleId,
      });
    }

    await autoRole.save();
    await reply.message.success(interaction, words.Configured);
  } catch (e) {
    console.log(`${e}`);
  }
}

async function disable(client, interaction) {
  const words = await getLocalization(interaction.locale, "auto-role");

  try {
    if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
      await reply.message.info(interaction, words.NotConfigured);
      return;
    }

    await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
    await reply.message.success(interaction, words.Disabled);
  } catch (e) {
    console.log(e);
  }
}
