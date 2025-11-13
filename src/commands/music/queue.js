import { Client, EmbedBuilder } from "discord.js";
import getPlayerActionRow from "../../utils/components/playerActionRow.js";
import { useQueue } from "discord-player";

import reply from "../../utils/core/replies.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "queue",
  description: "shows the current and next songs",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, `queue`);

    await interaction.deferReply();

    const MAX_TRACKS_DISPLAYED = 10;

    const queue = useQueue(interaction.guild);

    if (!queue?.channel || !queue?.currentTrack) {
      await reply.message.error(interaction, words.NoTrack, {
        context: "editReply",
      });
      return;
    }

    const embeds = [];
    let currentTrackEmbed = new EmbedBuilder().setColor([20, 240, 20]);
    let nextTracksEmbed;

    if (queue.tracks.size > 0) {
      let nextTracks = queue.tracks.data
        .slice(0, MAX_TRACKS_DISPLAYED)
        .map(
          (track, i) =>
            `\`${i + 1})\` \`${track.duration}\` ${track.title} [${track.requestedBy.displayName}]`,
        )
        .join(" \n\n");

      nextTracksEmbed = new EmbedBuilder()
        .setTitle(" ")
        .setFields([{ name: words.NextTracks, value: nextTracks }])
        .setFooter({
          text: `${queue.tracks.size} ${words.Trackss} - ${queue.durationFormatted}`,
          iconURL: client.user.avatarURL({ size: 1024 }),
        });
    } else {
      currentTrackEmbed.setFooter({
        text: `${queue.currentTrack.duration}`,
        iconURL: (queue.currentTrack?.requestedBy || client.user).avatarURL({
          size: 1024,
        }),
      });
    }

    currentTrackEmbed
      .setTitle(words.Playing)
      .setDescription(queue.currentTrack.description)
      .setURL(queue.currentTrack.url)
      .setImage(queue.currentTrack.thumbnail);

    embeds.push(currentTrackEmbed);
    if (nextTracksEmbed) embeds.push(nextTracksEmbed);

    await interaction.editReply({
      embeds: embeds,
      components: [getPlayerActionRow()],
    });
  },
};
