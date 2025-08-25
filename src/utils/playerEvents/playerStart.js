import { EmbedBuilder, MessageFlags } from 'discord.js';
import { GuildQueue, Track } from 'discord-player';
import getPlayerActionRow from "../../utils/playerActionRow.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: 'playerStart',

  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: async (queue, track) => {
    const words = await getLocalization(queue.metadata.preferredLocale, 'playerEvents/playerStart');

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