import {Client} from 'discord.js';
import getTypes from '../enums/dirtyWordTypes.js';


export default {
  name: 'dirty-word',
  contexts: ['register'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => interaction.respond(await getTypes(interaction)).catch(() => {})
}