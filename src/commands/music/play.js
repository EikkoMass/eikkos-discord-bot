import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import playerConfigs from "../../configs/player.json" with { type: "json" };
import { QueryType, useMainPlayer } from "discord-player";
import Enum from "../../enums/player/contexts.js";

import reply from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

import { getLocalization, formatMessage } from "../../utils/i18n.js";
const NAME = "play";
const vol = {
  min: 0,
  max: 100,
};

export default {
  name: NAME,
  description: "play a song on the voice channel",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    const words = await getLocalization(interaction.locale, NAME);

    await interaction.deferReply({
      flags: [MessageFlags.Ephemeral],
    });

    const link = interaction.options.get("song")?.value;
    let volume = interaction.options.get("volume")?.value || vol.max;

    if (volume > vol.max || volume < vol.min) {
      volume = vol.max;
    }

    const channel = interaction.member?.voice?.channel;
    const player = useMainPlayer();
    const embed = new EmbedBuilder();

    if (!channel) {
      return await reply.message.error(
        interaction,
        words.VoiceChannelRequired,
        {
          context: discord.replies.edit,
        },
      );
    }

    const result = await player.search(link, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!result.hasTracks()) {
      return await reply.message.info(interaction, words.NoResults, {
        context: discord.replies.edit,
      });
    }

    try {
      const { queue, track, searchResult } = await player.play(
        channel,
        result,
        {
          nodeOptions: {
            metadata: {
              guild: interaction.guild.id,
              channel: interaction.channel,
              preferredLocale: interaction.locale,
              context: Enum.MUSIC,
            },
            volume,
            ...playerConfigs,
          },
          requestedBy: interaction.user,
          connectionOptions: { deaf: true },
        },
      );

      if (searchResult.hasPlaylist()) {
        const playlist = searchResult.playlist;
        embed
          .setDescription(
            formatMessage(words.PlaylistAdded, [playlist.tracks.length]),
          )
          .setThumbnail(playlist.thumbnail)
          .setTitle(playlist.title)
          .setFooter({
            text: `${words.Duration}: ${playlist.durationFormatted}`,
          })
          .setURL(playlist.url);
      } else {
        embed
          .setDescription(
            formatMessage(words.TrackAdded, [
              queue.node.getTrackPosition(track) + 1,
            ]),
          )
          .setThumbnail(track.thumbnail)
          .setTitle(track.title)
          .setFooter({ text: `${words.Duration}: ${track.duration}` })
          .setURL(track.url);
      }
    } catch (e) {
      console.log(e);
    }

    await interaction.editReply({ embeds: [embed] });
  },

  options: [
    {
      name: "song",
      description: "link / name to the song",
      type: ApplicationCommandOptionType.String,
      required: true,
      autocomplete: true,
    },
    {
      name: "volume",
      description: "volume to play the song",
      type: ApplicationCommandOptionType.Integer,
    },
  ],
};
