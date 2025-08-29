import { Client } from 'discord.js';
import types from '../enums/noteContextTypes.js';


export default {
  name: 'notes',
  contexts: ['add', 'show'],

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: (client, interaction) => interaction.respond(types).catch(() => {})
}