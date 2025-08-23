import { EmbedBuilder, MessageFlags } from 'discord.js';
import { GuildQueue, Track } from 'discord-player';
import getPlayerActionRow from "../../utils/playerActionRow.js";

import { getI18n } from "../../utils/i18n.js";
const getLocalization = async locale => await import(`../../i18n/${getI18n(locale)}/playerEvents/playerStart.json`, { with: { type: 'json' } });

export default {
  name: 'playerStart',

  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: async (queue, track) => {
    const words = getLocalization(queue.metadata.preferredLocale);

    const embed = new EmbedBuilder()
    .setTitle(words.Playing)
    .setDescription(`${track.title} - ${queue.currentTrack.author}`)
    .setThumbnail(track.thumbnail)
    .setFooter({text: `${words.Duration}: ${track.duration}`})
    .setURL(track.url);

    let message = await queue.metadata.channel.send({
      embeds: [ embed ],
      flags: [ MessageFlags.SuppressNotifications ],
      components: [ getPlayerActionRow() ]
    });

    if(message) setTimeout(async () => await message.delete(), track.durationMS);
  }
}