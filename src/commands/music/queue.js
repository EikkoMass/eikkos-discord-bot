const { Client, Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const getPlayerActionRow = require("../../utils/playerActionRow")
const { useQueue } = require('discord-player')

module.exports =  {
  name: 'queue',
  description: 'shows the current song',
  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
  callback: async (client, interaction) => {
    await interaction.deferReply();
    const embed = new EmbedBuilder();
    const MAX_TRACKS_DISPLAYED = 10;

    const queue = useQueue(interaction.guild);

    if(!queue?.channel || !queue?.currentTrack)
    {
      await interaction.editReply({
        embeds: [embed.setDescription("There's no track playing.")],
      });
      return;
    }

    let fields, footer, banner;

    if(queue.tracks.size > 0)
    {
      let nextTracks = queue.tracks.data.slice(0, MAX_TRACKS_DISPLAYED).map((track, i) => `\`${i + 1})\` \`${track.duration}\` ${track.title} [${track.requestedBy.displayName}]`).join(" \n\n");
      fields = [{ name: 'Next Tracks', value: nextTracks }];
      footer = { text: `${queue.tracks.size} track(s) - ${queue.durationFormatted}`, iconURL: client.user.avatarURL({size: 1024}) };
    } else {
      banner = queue.currentTrack.thumbnail;
    }

    embed
      .setTitle(`Playing`)
      .setDescription(queue.currentTrack.description)
      .setURL(queue.currentTrack.url);

    if (fields) embed.setFields(fields);
    if (footer) embed.setFooter(footer);
    if (banner) embed.setImage(banner);

    await interaction.editReply({
      embeds: [embed],
      components: [getPlayerActionRow()],
    });
  }

}