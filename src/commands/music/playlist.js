import {
  Client,
  EmbedBuilder,
  MessageFlags,
  ApplicationCommandOptionType,
} from "discord.js";

import Playlist from "../../models/playlist.js";

import { useMainPlayer, QueryType } from "discord-player";
import playerConfigs from "../../configs/player.json" with { type: "json" };
import discord from "../../configs/discord.json" with { type: "json" };
import actions from "../../configs/actions.json" with { type: "json" };

import getPlaylistEmbeds from "../../utils/components/getPlaylistEmbeds.js";
import getPaginator from "../../utils/components/getPaginator.js";
import { getLocalization, formatMessage } from "../../utils/i18n.js";

import reply from "../../utils/core/replies.js";

const OPTS = {
  play: {
    name: "play",
    description: "play the selected playlist",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "name",
        description: "name of the saved playlist you want.",
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true,
      },
    ],
  },
  add: {
    name: "add",
    description: "adds a playlist context",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "name",
        description: "name scope to the playlist",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "link",
        description: "link to the playlist",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  remove: {
    name: "remove",
    description: "removes a playlist context",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        description:
          "playlist id  you want to remove (check with '/playlist list')",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  list: {
    name: "list",
    description: "show guild's playlists",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  name: "playlist",
  description: "pre-set playlists to quick play",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.add.name:
        return await add(client, interaction);
      case OPTS.play.name:
        return await play(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      case OPTS.list.name:
        return await list(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Playlist command not found!`,
        );
    }
  },
  options: [OPTS.add, OPTS.list, OPTS.play, OPTS.remove],
};

async function add(client, interaction) {
  const words = await getLocalization(interaction.locale, `playlist`);

  try {
    const name = interaction.options.get("name").value;
    const link = interaction.options.get("link").value;

    const playlist = new Playlist({
      name: name,
      link: link,
      guildId: interaction.guild.id,
      userId: interaction.user.id,
      creationDate: Date.now(),
    }).save();

    await reply.message.success(
      interaction,
      formatMessage(words.Added, [name]),
    );
  } catch (error) {
    console.error(error);
    await reply.message.error(interaction, words.ErrorAdding);
  }
}

async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, `playlist`);

  const id = interaction.options.get("id").value;

  const playlist = await Playlist.findById({ _id: id });

  if (playlist && playlist.guildId === interaction.guild.id) {
    await playlist.deleteOne();
    return await reply.message.success(
      interaction,
      formatMessage(words.Removed, [playlist.name]),
    );
  }

  return await reply.message.error(interaction, words.ErrorRemoving);
}

async function list(client, interaction) {
  const words = await getLocalization(interaction.locale, `playlist`);

  let query = {
    guildId: interaction.guild.id,
  };

  const page = 1;

  let count = await Playlist.countDocuments(query);
  let playlists = await Playlist.find(query)
    .sort({ _id: -1 })
    .skip((page - 1) * discord.embeds.max)
    .limit(discord.embeds.max);

  if (count > 0) {
    return await interaction.reply({
      embeds: await getPlaylistEmbeds(client, playlists),
      components: [
        getPaginator(
          {
            id: actions.playlist.list,
          },
          count,
          1,
          discord.embeds.max,
        ),
      ],
    });
  }

  return await reply.message.error(interaction, words.NotFound);
}

async function play(client, interaction) {
  const words = await getLocalization(interaction.locale, `playlist`);

  const embed = new EmbedBuilder();
  let link = interaction.options.get("name")?.value;
  let channel = interaction.member?.voice?.channel;
  let player = useMainPlayer();

  await interaction.deferReply({
    flags: [MessageFlags.Ephemeral],
  });

  if (!channel) {
    await reply.message.error(interaction, words.VoiceChannelRequired, {
      context: "editReply",
    });
    return;
  }

  const result = await player.search(link, {
    requestedBy: interaction.user,
    searchEngine: QueryType.AUTO,
  });

  const { queue, track, searchResult } = await player.play(channel, result, {
    nodeOptions: {
      metadata: {
        channel: interaction.channel,
        preferredLocale: interaction.locale,
      },
      ...playerConfigs,
    },
    requestedBy: interaction.user,
    connectionOptions: { deaf: true },
  });

  const playlist = searchResult.playlist;

  if (!searchResult || !playlist) {
    await reply.message.error(interaction, words.NotFound, {
      context: "editReply",
    });
    return;
  }

  embed
    .setDescription(
      formatMessage(words.PlaylistAdded, [playlist.tracks.length]),
    )
    .setThumbnail(playlist.thumbnail)
    .setTitle(playlist.title)
    .setFooter({ text: `${words.Duration}: ${playlist.durationFormatted}` })
    .setURL(playlist.url);

  await interaction.editReply({
    embeds: [embed],
  });
}
