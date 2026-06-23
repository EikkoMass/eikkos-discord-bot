import { EmbedBuilder, MessageFlags, Colors } from "discord.js";
import { GuildQueue, Track as DpTrack } from "discord-player";
import getPlayerActionRow from "../../utils/components/playerActionRow.js";

import cache from "../../utils/cache/queue.js";

import Track from "../../models/track.js";
import TrackAnalytics from "../../models/trackAnalytics.js";

import { getLocalization } from "../../utils/i18n.js";
import Enum from "../../enums/player/contexts.js";

export default {
  name: "playerStart",

  /**
   * @param {GuildQueue} queue
   * @param {DpTrack} track
   */
  callback: async (queue, track) => {
    if (queue.metadata.context === Enum.TTS) return;

    const CACHE_REF = `${queue.metadata.guild}`;

    if (cache.get(CACHE_REF)) {
      await cache.get(CACHE_REF)();
      cache.resetOne(CACHE_REF);
    }

    const words = await getLocalization(
      queue.metadata.preferredLocale,
      "playerEvents/playerStart",
    );

    const MIN_EMBED_SIZE = 120;

    let description = `${track.title} - ${queue.currentTrack.author}`;
    let footer = `${words.Duration}: ${track.duration}`;

    const embed = new EmbedBuilder()
      .setTitle(words.Playing)
      .setDescription(description)
      .setThumbnail(track.thumbnail)
      .setFooter({
        text: footer.padEnd(MIN_EMBED_SIZE - footer.length - 1, " ") + "\u200B",
      })
      .setColor(Colors.Blurple)
      .setURL(track.url);

    let message = await queue.metadata.channel.send({
      embeds: [embed],
      flags: [MessageFlags.SuppressNotifications],
      components: [getPlayerActionRow()],
    });

    try {
      let dbTrack = await Track.findOne({
        link: track.url,
      });

      if (!dbTrack) {
        dbTrack = new Track({
          title: track.title,
          author: queue.currentTrack.author,
          link: track.url,
          thumbnail: track.thumbnail,
        });

        await dbTrack.save();
      }

      let trackAnalytics = await TrackAnalytics.findOne({
        guildId: queue.metadata.guild,
        link: dbTrack._id,
      });

      if (trackAnalytics) {
        trackAnalytics.amount += 1;
        trackAnalytics.lastPlayed = new Date();
        trackAnalytics.lastUser = track.requestedBy.id;
      } else {
        trackAnalytics = new TrackAnalytics({
          guildId: queue.metadata.guild,
          trackId: dbTrack._id,
          amount: 1,
          firstPlayed: new Date(),
          lastPlayed: new Date(),
          lastUser: track.requestedBy.id,
        });
      }

      await trackAnalytics.save();
    } catch (error) {
      // ignore
    }

    if (message) {
      cache.set(
        CACHE_REF,
        async () => {
          try {
            await message.delete();
          } catch (error) {}
        },
        track.durationMS,
      );
    }
  },
};
