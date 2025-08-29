import { Client } from 'discord.js';
import { QueueRepeatMode } from 'discord-player';


export default {
  name: 'repeat',

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: (client, interaction) => {
    try {
      interaction.respond([
        {name: 'Current track', value: QueueRepeatMode.TRACK},
        {name: 'Entire queue', value: QueueRepeatMode.QUEUE},
        {name: 'Disable', value: QueueRepeatMode.OFF},
      ]).catch(() => {});
    } catch (e) {
      console.log(e);
    }
  }
}