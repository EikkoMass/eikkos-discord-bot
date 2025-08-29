import {Client} from 'discord.js';
import types from '../enums/dirtyWordTypes.js';


export default {
  name: 'dirty-word',
  contexts: ['register'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: (client, interaction) => interaction.respond(types).catch(() => {})
}