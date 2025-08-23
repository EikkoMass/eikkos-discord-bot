import { Client } from 'discord.js';
import types from '../../../enums/noteContextTypes.js';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'notes') return;
    if(!['add', 'show'].includes(interaction.options.getSubcommand())) return;

    interaction.respond(types).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}