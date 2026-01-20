import {
  Client,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} from "discord.js";
import ActionRowRole from "../../models/actionRowRole.js";
import RoleContext from "../../models/roleContext.js";
import actions from "../../configs/actions.json" with { type: "json" };
import { Types } from "mongoose";

import reply from "../../utils/core/replies.js";

import { getLocalization } from "../../utils/i18n.js";

const OPTS = {
  add: {
    name: "add",
    description: "Add / edit an role to be selected",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "role",
        required: true,
        description: "The role that use want to add",
        type: ApplicationCommandOptionType.Role,
      },
      {
        name: "label",
        required: true,
        description: "The name of the role",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "style",
        description: "The role that use want to add",
        type: ApplicationCommandOptionType.Number,
        autocomplete: true,
      },
      {
        name: "context",
        description: "What's the button context",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },
  remove: {
    name: "remove",
    description: "Removes a role to the selection",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "role",
        required: true,
        description: "The role that use want to remove",
        type: ApplicationCommandOptionType.Role,
      },
      {
        name: "context",
        description: "What's the button context",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
      },
    ],
  },
  choose: {
    name: "choose",
    description: "Chooses an role around the added",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "context",
        description: "What's the button context",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
      },
    ],
  },
};

export default {
  name: "role",
  description: "Set a new role.",
  options: [OPTS.add, OPTS.remove, OPTS.choose],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.choose.name:
        return await choose(client, interaction);
      case OPTS.add.name:
        return await add(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Role command not found!`,
        );
    }
  },
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function add(client, interaction) {
  const words = await getLocalization(interaction.locale, `role`);

  try {
    const roleParam = interaction.options.get("role")?.value;
    const labelParam = interaction.options.get("label")?.value;
    const styleParam = interaction.options.get("style")?.value;
    const contextParam = interaction.options?.get("context")?.value;

    if (
      styleParam &&
      (styleParam < ButtonStyle.Primary || styleParam > ButtonStyle.Danger)
    ) {
      return await reply.message.error(interaction, words.InvalidStyleOption);
    }

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      return await reply.message.error(interaction, words.CannotManageRoles);
    }

    const searchParams = { guildId: interaction.guild.id, roleId: roleParam };
    let context = {};

    if (contextParam) {
      context = await RoleContext.findOne({
        name: contextParam,
        guildId: interaction.guild.id,
      });

      if (!context) {
        context = new RoleContext({
          name: contextParam,
          guildId: interaction.guild.id,
        });

        await context.save();
      }

      searchParams.context = context._id;
    }

    let role = await ActionRowRole.findOne(searchParams);

    if (role) {
      role.label = labelParam;
      role.style = styleParam || ButtonStyle.Primary;
      role.context = context._id;
    } else {
      role = new ActionRowRole({
        guildId: interaction.guild.id,
        label: labelParam,
        roleId: roleParam,
        style: styleParam || ButtonStyle.Primary,
        context: context._id,
      });
    }

    await role.save();
    await reply.message.success(
      interaction,
      `${words.RoleAddedEdited}${context ? ` ${words.OnContext} '` + (context.name || words.NotSpecified) + "'" : ""}!`,
    );
  } catch (error) {
    console.log(error);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function choose(client, interaction) {
  const words = await getLocalization(interaction.locale, `role`);

  try {
    const row = new ActionRowBuilder();

    const context = interaction.options?.get("context")?.value;

    const searchParams = { guildId: interaction.guild.id };

    searchParams.context = context
      ? new Types.ObjectId(`${context}`)
      : { $eq: null };

    let roles = await ActionRowRole.find(searchParams);

    if (!roles?.length) {
      return await reply.message.error(
        interaction,
        words.NoRolesRegisteredOnGuild,
      );
    }

    roles.forEach((role) =>
      row.components.push(
        new ButtonBuilder()
          .setCustomId(
            JSON.stringify({
              id: actions.role.main,
              roleId: role.roleId,
              hash: crypto.randomUUID(),
            }),
          )
          .setLabel(role.label)
          .setStyle(role.style || ButtonStyle.Primary),
      ),
    );

    await interaction.reply({
      content: words.ClaimRemoveRole,
      components: [row],
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, `role`);

  const roleParam = interaction.options.get("role")?.value;
  const contextParam = interaction.options?.get("context")?.value;

  const searchParams = { guildId: interaction.guild.id, roleId: roleParam };

  if (contextParam) {
    const context = await RoleContext.findOne({
      guildId: interaction.guild.id,
      _id: new Types.ObjectId(`${contextParam}`),
    });
    searchParams.context = context._id || { $eq: null };
  }

  const role = await ActionRowRole.findOneAndDelete(searchParams);

  if (role) {
    if (contextParam) {
      const remainingContextRoles = await ActionRowRole.countDocuments({
        guildId: interaction.guild.id,
        context: new Types.ObjectId(`${contextParam}`),
      });

      if (remainingContextRoles == 0) {
        await RoleContext.findOneAndDelete({
          guildId: interaction.guild.id,
          _id: new Types.ObjectId(`${contextParam}`),
        });
      }
    }

    return await reply.message.success(interaction, words.RoleRemoved);
  }

  return await reply.message.error(interaction, words.NoRoleFound);
}
