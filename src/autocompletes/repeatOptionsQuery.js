import { Client } from 'discord.js';
import { QueueRepeatMode } from 'discord-player';

import { getLocalization } from '../utils/i18n.js';

export default {
  name: 'repeat',

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: async (client, interaction) => {
    try {

      const words = await getLocalization(interaction.locale, `repeat`);

      interaction.respond([
        {name: words.CurrentTrack, value: QueueRepeatMode.TRACK},
        {name: words.EntireQueue, value: QueueRepeatMode.QUEUE},
        {name: words.Disable, value: QueueRepeatMode.OFF},
      ]).catch(() => {});
    } catch (e) {
      console.log(e);
    }
  }
}