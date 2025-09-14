import { Client } from 'discord.js';
import getTypes from '../enums/noteContextTypes.js';


export default {
  name: 'notes',
  contexts: ['add', 'show'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    
    interaction.respond(await getTypes(interaction)).catch(() => {})}
}