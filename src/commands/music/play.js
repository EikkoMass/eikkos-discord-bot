const {Client, Interaction, ApplicationCommandOptionType, EmbedBuilder, MessageFlags } = require('discord.js');
const playerConfigs = require('../../configs/player.json');
const { QueryType, useMainPlayer } = require('discord-player')

const { getI18n, formatMessage } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/play`);

module.exports =  {
  name: 'play',
  description: 'play a song on the voice channel',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    const words = getLocalization(interaction.locale);

    await interaction.deferReply({ 
      flags: [ MessageFlags.Ephemeral ] 
    });
    const link = interaction.options.get('song')?.value;
    let volume = interaction.options.get('volume')?.value || 100;

    if(volume > 100 || volume < 0) volume = 100;
    
    const channel = interaction.member?.voice?.channel;
    const player = useMainPlayer();
    const embed = new EmbedBuilder();

    if(!channel)
    {
      await interaction.editReply({
        embeds: [embed.setDescription(words.VoiceChannelRequired)],
      });
      return;
    }

    const result = await player.search(link, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO
    });

    if(!result.hasTracks())
    {
      await interaction.editReply(words.NoResults);
      return;
    }

    try {
      const { queue, track, searchResult } = await player.play(channel, result, {
        nodeOptions: {
          metadata: { channel: interaction.channel },
          volume,
          ...playerConfigs
        },
        requestedBy: interaction.user,
        connectionOptions: { deaf: true },
      });

      if (searchResult.hasPlaylist()) {
        const playlist = searchResult.playlist;
        embed
          .setDescription(formatMessage(words.PlaylistAdded, [playlist.tracks.length]))
          .setThumbnail(playlist.thumbnail)
          .setTitle(playlist.title)
          .setFooter({text: `${words.Duration}: ${playlist.durationFormatted}`})
          .setURL(playlist.url);
      } else {
        embed
          .setDescription(formatMessage(words.TrackAdded, [queue.node.getTrackPosition(track) + 1]))
          .setThumbnail(track.thumbnail)
          .setTitle(track.title)
          .setFooter({text: `${words.Duration}: ${track.duration}`})
          .setURL(track.url);
      }

      queue.metadata.preferredLocale = interaction.locale;
    } catch(e) {
      console.log(e);
    } 

    await interaction.editReply({embeds: [embed]});
  },

  options: [
    {
      name: 'song',
      description: 'link / name to the song',
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true
    },
    {
      name: 'volume',
      description: 'volume to play the song',
      type: ApplicationCommandOptionType.Integer,
    }
  ]
}