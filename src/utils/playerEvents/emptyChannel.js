const { EmbedBuilder } = require('discord.js');
const { GuildQueue, Track } = require('discord-player');

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/playerEvents/emptyChannel`);

module.exports = {
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