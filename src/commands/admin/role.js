const {Client, Interaction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ActionRowRole = require('../../models/actionRowRole');

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
  description: 'Set a new role',
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
        }
      ]
    },
    {
      name: 'choose',
      description: 'Chooses an role around the added',
      type: ApplicationCommandOptionType.Subcommand
    },
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

    let role = await ActionRowRole.findOne({ guildId: interaction.guild.id, roleId: roleParam});

    if(role)
    {
      role.label = labelParam;
      role.style = styleParam || ButtonStyle.Primary;
    } else {
      role = new ActionRowRole({
        guildId: interaction.guild.id,
        label: labelParam,
        roleId: roleParam,
        style: styleParam || ButtonStyle.Primary
      });
    }

    await role.save();
    interaction.reply(
    {
      ephemeral: true,
      content: 'Role added / edited successfully!',
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

    let roles = await ActionRowRole.find({ guildId: interaction.guild.id });
    
    if(!roles)
    {
      await interaction.reply(
        {
          content: 'There\'s no roles registered on this guild, use the command \'/role add <your-role>\'',
          ephemeral: true,
      });
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

  const role = await ActionRowRole.findOneAndDelete({ guildId: interaction.guild.id, roleId: roleParam });

  if(role)
  {
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