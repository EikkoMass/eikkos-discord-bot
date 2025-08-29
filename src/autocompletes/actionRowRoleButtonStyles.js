import {Client} from 'discord.js';
import styles from '../enums/buttonStyles.js';


export default {

  name: 'role',
  contexts: ['add'],
  
  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: (client, interaction) => interaction.respond(styles).catch(() => {})
}