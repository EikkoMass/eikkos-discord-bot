const {Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ActionRowRole = require('../../models/actionRowRole');
const RoleContext = require('../../models/roleContext');
const { Types } = require('mongoose');

module.exports = {

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'choose':
        await choose(client, interaction);
        break;
      case 'add':
        await add(client, interaction);
        break;
      case 'remove':
        await remove(client, interaction);
        break;
      default:
        await interaction.reply({
          ephemeral: true,
          content: `Role command not found!`
        });
        return;
    }
  },

  name: 'role',
  description: 'Set a new role.',
  options: [
    {
      name: 'add',
      description: 'Add / edit an role to be selected',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'role',
          required: true,
          description: 'The role that use want to add',
          type: ApplicationCommandOptionType.Role
        },
        {
          name: 'label',
          required: true,
          description: 'The name of the role',
          type: ApplicationCommandOptionType.String
        },
        {
          name: 'style',
          description: 'The role that use want to add',
          type: ApplicationCommandOptionType.Number,
          autocomplete: true
        },
        {
          name: 'context',
          description: 'What\'s the button context',
          type: ApplicationCommandOptionType.String,
        }
      ]
    },
    {
      name: 'remove',
      description: 'Removes a role to the selection',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'role',
          required: true,
          description: 'The role that use want to remove',
          type: ApplicationCommandOptionType.Role
        },
        {
          name: 'context',
          description: 'What\'s the button context',
          type: ApplicationCommandOptionType.String,
          autocomplete: true
        }
      ]
    },
    {
      name: 'choose',
      description: 'Chooses an role around the added',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'context',
          description: 'What\'s the button context',
          type: ApplicationCommandOptionType.String,
          autocomplete: true
        }
      ]
    }
  ]
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function add(client, interaction)
{
  try {

    const roleParam = interaction.options.get('role')?.value;
    const labelParam = interaction.options.get('label')?.value;
    const styleParam = interaction.options.get('style')?.value;
    const contextParam = interaction.options?.get('context')?.value;

    if(styleParam && (styleParam < ButtonStyle.Primary || styleParam > ButtonStyle.Danger))
    {
      await interaction.reply(
        {
          ephemeral: true,
          content: 'Invalid style option!',
        }
      );
      return;
    }

    if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
    {
      await interaction.reply(
        {
          ephemeral: true,
          content: 'You cannot manage roles!',
        }
      );
      return;
    }

    const searchParams = { guildId: interaction.guild.id, roleId: roleParam };
    let context = {};

    if(contextParam)
    {
      context = await RoleContext.findOne({ name: contextParam, guildId: interaction.guild.id });

      if(!context)
      {
        context = new RoleContext({
          name: contextParam,
          guildId: interaction.guild.id
        });

        await context.save();
      }

      searchParams.context = context._id;
    }

    let role = await ActionRowRole.findOne(searchParams);

    if(role)
    {
      role.label = labelParam;
      role.style = styleParam || ButtonStyle.Primary;
      role.context = context._id;
    } else {
      role = new ActionRowRole({
        guildId: interaction.guild.id,
        label: labelParam,
        roleId: roleParam,
        style: styleParam || ButtonStyle.Primary,
        context: context._id
      });
    }

    await role.save();
    interaction.reply(
    {
      ephemeral: true,
      content: `Role added / edited successfully${context ? " on context '" + (context.name || 'not specified') + "'" : ''}!`,
    }
    );
  } catch (error) {
    console.log(error);
  } 
}


/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function choose(client, interaction)
{
  try {
    const row = new ActionRowBuilder();

    const context = interaction.options?.get('context')?.value;

    const searchParams = { guildId: interaction.guild.id };

    searchParams.context = context ? new Types.ObjectId(`${context}`) : { $eq: null };

    let roles = await ActionRowRole.find(searchParams);

    if(!roles?.length)
    {
      await interaction.reply(
        {
          content: 'There\'s no roles registered on this guild, use the command \'/role add <your-role>\'',
          ephemeral: true,
        }
      );
      return;
    }

    roles.forEach(
      role => 
        row.components.push(
          new ButtonBuilder()
            .setCustomId(`role;${role.roleId}`)
            .setLabel(role.label)
            .setStyle(role.style || ButtonStyle.Primary)
        )
    );

    await interaction.reply(
      {
        content: 'Claim of remove a role below',
        components: [row],
      }
    );

  } catch (error) {
    console.log(error);
  } 
}

/**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
async function remove(client, interaction)
{
  const roleParam = interaction.options.get('role')?.value;
  const contextParam = interaction.options?.get('context')?.value;

  const searchParams = { guildId: interaction.guild.id, roleId: roleParam };

  if(contextParam)
  {
    const context = await RoleContext.findOne({ guildId: interaction.guild.id, _id: new Types.ObjectId(`${contextParam}`)})
    searchParams.context = context._id || { $eq: null };
  }

  const role = await ActionRowRole.findOneAndDelete(searchParams);

  if(role)
  {
    if(contextParam)
    {
      const remainingContextRoles = await ActionRowRole.countDocuments({ guildId: interaction.guild.id, context: new Types.ObjectId(`${contextParam}`)})

      if(remainingContextRoles == 0)
      {
        await RoleContext.findOneAndDelete({ guildId: interaction.guild.id, _id: new Types.ObjectId(`${contextParam}`)});
      }
    }

    await interaction.reply(
      {
        content: 'Role removed successfully!',
        ephemeral: true,
    });
    return;
  }

  await interaction.reply(
    {
      content: 'No role was found!',
      ephemeral: true,
  });  
}