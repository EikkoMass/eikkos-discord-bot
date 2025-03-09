const { EmbedBuilder } = require('discord.js');
const { GuildQueue, Track } = require('discord-player');

module.exports = {
  name: 'emptyChannel',
  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: (queue, track) => {
    queue.metadata.channel.send({
      embeds: [new EmbedBuilder().setDescription(":broken_heart: Leaving the voice channel because i'm alone and sad, goodbye!")],
    });
  } 
}