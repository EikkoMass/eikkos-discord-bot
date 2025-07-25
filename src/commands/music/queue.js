const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const getPlayerActionRow = require("../../utils/playerActionRow");
const { useQueue } = require('discord-player');

const { getI18n } = require("../../utils/i18n");
const getLocalization = locale => require(`../../i18n/${getI18n(locale)}/queue`);

module.exports =  {
  name: 'queue',
  description: 'shows the current and next songs',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {

    const words = getLocalization(interaction.locale);

    await interaction.deferReply();
    
    const MAX_TRACKS_DISPLAYED = 10;

    const queue = useQueue(interaction.guild);

    if(!queue?.channel || !queue?.currentTrack)
    {
      await interaction.editReply({
        embeds: [new EmbedBuilder().setDescription(words.NoTrack)],
      });
      return;
    }

    const embeds = [];
    let currentTrackEmbed = new EmbedBuilder().setColor([20, 240, 20]);
    let nextTracksEmbed;

    if(queue.tracks.size > 0)
    {
      let nextTracks = queue.tracks.data.slice(0, MAX_TRACKS_DISPLAYED).map((track, i) => `\`${i + 1})\` \`${track.duration}\` ${track.title} [${track.requestedBy.displayName}]`).join(" \n\n");
      
      nextTracksEmbed = new EmbedBuilder()
        .setTitle(" ")
        .setFields([{ name: words.NextTracks, value: nextTracks }])
        .setFooter({ text: `${queue.tracks.size} ${words.Trackss} - ${queue.durationFormatted}`, iconURL: client.user.avatarURL({size: 1024}) });

    } else {
      currentTrackEmbed.setFooter({ text: `${queue.currentTrack.duration}`, iconURL: client.user.avatarURL({size: 1024}) })
    }

    currentTrackEmbed
      .setTitle(words.Playing)
      .setDescription(queue.currentTrack.description)
      .setURL(queue.currentTrack.url)
      .setImage(queue.currentTrack.thumbnail);

    embeds.push(currentTrackEmbed);
    if(nextTracksEmbed) embeds.push(nextTracksEmbed);

    await interaction.editReply({
      embeds: embeds,
      components: [getPlayerActionRow()],
    });
  }

}