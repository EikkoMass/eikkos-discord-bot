const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');
const { MessageFlags } = require('discord.js');

module.exports = async (client, interaction) => {
  if(!interaction.isChatInputCommand()) return;

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);

    if(!commandObject) return;

    if(commandObject.devOnly) {
      if(!devs.includes(interaction.member.id))
      {
        interaction.reply({
          content: `Only devs are allowed to run this command`,
          flags: [ MessageFlags.Ephemeral ],
        });
        return;
      }
    }



    if(commandObject.testOnly) {
      if(interaction.guild.id !== testServer)
      {
        interaction.reply({
          content: `This command cannot be ran here`,
          flags: [ MessageFlags.Ephemeral ],
        });
        return;
      }
    }

    if(commandObject.permissionsRequired?.length) {
      for(const permission of commandObject.permissionsRequired)
      {
        if(!interaction.member.permissions.has(permission))
        {
          interaction.reply({
            content: `Not enough permissions`,
            flags: [ MessageFlags.Ephemeral ],
          });
          continue;
        }
      }
    }

    if(commandObject.botPermissions?.length)
    {
      for(const permission of commandObject.botPermissions)
      {
        const bot = interaction.guild.members.me;

        if(!bot.permissions.has(permission))
        {
          interaction.reply({
            content: `I don't have enough permissions`,
            flags: [ MessageFlags.Ephemeral ],
          });
          continue;
        }
      }
    }

    await commandObject.callback(client, interaction);

  } catch (error)
  {
    console.log(`There was an error running this command: ${error}`);
  }
}