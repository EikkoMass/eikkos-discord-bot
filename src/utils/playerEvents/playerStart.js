const { EmbedBuilder } = require('discord.js');
const { GuildQueue, Track } = require('discord-player');

module.exports = {
  name: 'playerStart',

  /**
   * @param {GuildQueue} queue 
   * @param {Track} track 
  */
  callback: (queue, track) => {
    const embed = new EmbedBuilder()
    .setTitle(track.title)
    .setDescription(queue.currentTrack.author)
    .setThumbnail(track.thumbnail)
    .setFooter({text: `duration: ${track.duration}`})
    .setURL(track.url);

    queue.metadata.channel.send({embeds: [embed]});
  }
}