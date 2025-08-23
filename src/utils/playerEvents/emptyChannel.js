import { EmbedBuilder } from 'discord.js';
import { GuildQueue, Track } from 'discord-player';

import { getI18n } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/playerEvents/emptyChannel.json`, { with: { type: 'json' } });

export default {
  name: 'emptyChannel',
  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: (queue, track) => {

    if (queue && !queue.deleted) {
      const words = getLocalization(queue.metadata.preferredLocale);
      
      queue.delete();

      queue.metadata.channel.send({
        embeds: [new EmbedBuilder().setDescription(`:broken_heart: ${words.LeavingVC}`)],
      });
    }
  } 
}