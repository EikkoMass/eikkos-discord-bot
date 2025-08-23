import {Client} from 'discord.js';
import editions from '../../../enums/minecraftEditions.js';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'minecraft') return;
    if(interaction.options.getSubcommand() !== 'register') return;

    interaction.respond(editions).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}