import {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  MessageFlags,
  EmbedBuilder,
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
  /**
   *  @param {Client} client
   *  @param interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.configure.name:
        await configure(client, interaction);
        break;
      case OPTS.disable.name:
        await disable(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [
            new EmbedBuilder().setDescription(`Auto role command not found!`),
          ],
        });
        return;
    }
  },

  name: "autorole",
  description: "Manage the server auto-role",
  options: [OPTS.configure, OPTS.disable],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};

async function configure(client, interaction) {
  const embed = new EmbedBuilder();
  const words = await getLocalization(interaction.locale, "auto-role");

  if (!interaction.inGuild()) {
    interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [embed.setDescription(words.OnlyInsideServer)],
    });
    return;
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
