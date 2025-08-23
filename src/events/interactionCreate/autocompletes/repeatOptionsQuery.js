import {Client} from 'discord.js';
import { QueueRepeatMode } from 'discord-player';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'repeat') return;

    interaction.respond([
      {name: 'Current track', value: QueueRepeatMode.TRACK},
      {name: 'Entire queue', value: QueueRepeatMode.QUEUE},
      {name: 'Disable', value: QueueRepeatMode.OFF},
    ]).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}