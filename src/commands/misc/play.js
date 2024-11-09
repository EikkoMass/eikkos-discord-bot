const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js');

const { QueryType, useMainPlayer } = require('discord-player')

module.exports =  {
  name: 'play',
  description: 'play a song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const link = interaction.options.get('link')?.value;
    let volume = interaction.options.get('volume')?.value || 100;

    if(volume > 100 || volume < 0) volume = 100;

    const channel = interaction.member?.voice?.channel;
    const player = useMainPlayer();
    const embed = new EmbedBuilder();

    if(!channel)
    {
      await interaction.editReply({
        ephemeral: true,
        embeds: [embed.setDescription("You need to be in a voice channel!")],
      });
      return;
    }

    const result = await player.search(link, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
    });

    if(!result.hasTracks())
    {
      await interaction.editReply("No results found");
      return;
    }

    try {
        const { queue, track, searchResult } = await player.play(channel, result, {
          nodeOptions: {
            metadata: { channel: interaction.channel },
            volume,
            leaveOnStop: false,
            pauseOnEmpty: true,
            leaveOnEmpty: false,
            leaveOnEmptyCooldown: 60000,
            leaveOnEnd: false,
            leaveOnEndCooldown: 60000,
          },
          requestedBy: interaction.user,
          connectionOptions: { deaf: true },
        });

        if (searchResult.hasPlaylist()) {
          const playlist = searchResult.playlist;
          embed
            .setDescription(`Playlist added - ${playlist.tracks.length} tracks`)
            .setThumbnail(playlist.thumbnail)
            .setTitle(playlist.title)
            .setFooter({text: `duration: ${playlist.durationFormatted}`})
            .setURL(playlist.url);
        } else {
          embed
            .setDescription(`Track added - Position ${queue.node.getTrackPosition(track) + 1}`)
            .setThumbnail(track.thumbnail)
            .setTitle(track.title)
            .setFooter({text: `duration: ${track.duration}`})
            .setURL(track.url);
        }
      } catch(e) {
        console.log(e);
      } 

      await interaction.editReply({embeds: [embed]});
  },

  options: [
    {
      name: 'link',
      description: 'link to the song',
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: 'volume',
      description: 'volume to play the song',
      type: ApplicationCommandOptionType.Integer,
    }
  ]
}