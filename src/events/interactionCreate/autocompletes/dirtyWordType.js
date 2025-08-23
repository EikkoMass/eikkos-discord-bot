import {Client} from 'discord.js';
import types from '../../../enums/dirtyWordTypes.js';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'dirty-word') return;
    if(interaction.options.getSubcommand() !== 'register') return;

    interaction.respond(types).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}