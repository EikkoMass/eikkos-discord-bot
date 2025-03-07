const { Track, GuildQueue } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = (eventListener) => {
  for (let event of events)
  {
    eventListener.on(event.name, event.callback);
  }
}

const events = [
  {
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
]