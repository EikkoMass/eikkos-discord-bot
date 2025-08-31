import config from '../../../config.json' with { type: 'json' };
import getLocalContextMenus from '../../utils/getLocalContextMenus.js';
import { MessageFlags, EmbedBuilder, Client } from 'discord.js';

/**
 *  @param {Client} client
 *  @param  interaction
*/
export default async (client, interaction) => {
  if(!interaction.isContextMenuCommand()) return;

  try {
    const localCommands = await getLocalContextMenus();
    const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);

    if(!commandObject) return;
    
    if (
      checkDevOnly(interaction, commandObject) &&
      checkTestOnly(interaction, commandObject) &&
      checkUserPermissions(interaction, commandObject) &&
      checkBotPermissions(interaction, commandObject)
    )
    {
      await commandObject.callback(client, interaction);
    }
  } catch (error)
  {
    console.log(`There was an error running this contextMenu: ${error}`);
  }
}

function checkDevOnly(interaction, commandObject)
{
  return (!commandObject.devOnly || config.devs.includes(interaction.member.id)) 
    || reply(interaction, `Only devs are allowed to run this contextMenu`);
}

function checkTestOnly(interaction, commandObject) 
{  
  return (!commandObject.testOnly || interaction.guild.id === config.testServer) 
    || reply(interaction, `This command cannot be ran here`);
}

function checkUserPermissions(interaction, commandObject)
{
  if(commandObject.permissionsRequired?.length) {
    for(const permission of commandObject.permissionsRequired)
    {
      if(!interaction.member.permissions.has(permission)) 
        return reply(interaction, `Not enough permissions`);
    }
  }

  return true;
}

function checkBotPermissions(interaction, commandObject)
{
  if(commandObject.botPermissions?.length)
  {
    const bot = interaction.guild.members.me;

    for(const permission of commandObject.botPermissions)
    {
      if(!bot.permissions.has(permission))
        return reply(interaction, `I don't have enough permissions`);
    }
  }

  return true;
}

function reply(interaction, message)
{
  interaction.reply({
    embeds: [ new EmbedBuilder().setDescription(message) ],
    flags: [ MessageFlags.Ephemeral ],
  });
}

