const { EmbedBuilder, MessageFlags } = require('discord.js');
const { GuildQueue, Track } = require('discord-player');
const getPlayerActionRow = require("../../utils/playerActionRow");

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/playerEvents/playerStart`);

module.exports = {
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