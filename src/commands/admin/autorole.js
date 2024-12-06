const { ApplicationCommandOptionType, PermissionFlagsBits, Client, Interaction } = require('discord.js');
const AutoRole = require('../../models/autorole');

module.exports = {

  /**
 *  @param {Client} client
 *  @param {Interaction} interaction
*/
  callback: async (client, interaction) => {
    switch(interaction.options.getSubcommand())
    {
      case 'configure':
        await configure(client, interaction);
        break;
      case 'disable':
        await disable(client, interaction);
        break;
      default:
        await interaction.reply({
          ephemeral: true,
          content: `Autorole command not found!`
        });
        return;
    }
  },

  name: 'autorole',
  description: 'Manage the server auto-role',
  options: [
    {
      name: 'configure',
      description: 'Configure your auto-role for this server.',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'role',
          description: 'The role you want users to get on join.',
          type: ApplicationCommandOptionType.Role,
          required: true
        }
      ]
    },
    {
      name: 'disable',
      description: 'Disable auto-role in this server.',
      type: ApplicationCommandOptionType.Subcommand
    },
  ],
  permissionsRequired: [
    PermissionFlagsBits.Administrator
  ],
  botPermissions: [
    PermissionFlagsBits.ManageRoles
  ]
}

async function configure(client, interaction) {
  if(!interaction.inGuild())
    {
      interaction.reply({
        ephemeral: true,
        content: 'You can only run this command inside a server.'
      });
      return;
    }

    const targetRoleId = interaction.options.get('role').value;

    try {
      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if(autoRole){
        if(autoRole.roleId === targetRoleId)
        {
          interaction.reply({
            ephemeral: true,
            content: "Auto role has already been configured for that role. To disable run '/autorole disable'"
          })
          return;
        }

        autoRole.roleId = targetRoleId;
      } else {
        autoRole = new AutoRole({
          guildId: interaction.guildId,
          roleId: targetRoleId
        });
      }

      await autoRole.save();
      interaction.reply({
        ephemeral: true,
        content: "Autorole has now been configured. To disable run '/autorole disable'"
      });
    } catch(e)
    {
      console.log(`${e}`);
    }
}

async function disable(client, interaction) {
  try {

    if(!(await AutoRole.exists({guildId: interaction.guild.id})))
    {
      interaction.reply({
        ephemeral: true,
        content: "Auto role has not been configured for this server. Use '/autorole configure' to set it up."
      })
      return;
    }

    await AutoRole.findOneAndDelete({guildId: interaction.guild.id});
    interaction.reply({
      ephemeral: true,
      content: "Auto role has been disabled for this server. Use '/autorole configure' to set it up again."
    })
   } catch (e) {
    console.log(e);
   }
}