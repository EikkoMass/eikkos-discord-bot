import { EmbedBuilder } from 'discord.js';
import { GuildQueue, Track } from 'discord-player';

import { getLocalization } from "../utils/i18n.js";

export default {
  name: 'emptyChannel',
  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: async (queue, track) => {

    if (queue && !queue.deleted) {
      const words = await getLocalization(queue.metadata.preferredLocale, `playerEvents/emptyChannel`);
      
      queue.delete();

      queue.metadata.channel.send({
        embeds: [new EmbedBuilder().setDescription(`:broken_heart: ${words.LeavingVC}`)],
      });
    }
  } 
}