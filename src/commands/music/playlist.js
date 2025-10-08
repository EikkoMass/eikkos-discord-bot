import {
  Client,
  EmbedBuilder,
  MessageFlags,
  ApplicationCommandOptionType,
  ButtonStyle,
} from "discord.js";

import Playlist from "../../models/playlist.js";

import getPlaylistEmbeds from "../../utils/components/getPlaylistEmbeds.js";
import getPaginator from "../../utils/components/getPaginator.js";
import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "playlist",
  description: "pre-set playlists to quick play",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "add":
        await add(client, interaction);
        break;
      case "remove":
        await remove(client, interaction);
        break;
      case "list":
        await list(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: MessageFlags.Ephemeral,
          embeds: [
            new EmbedBuilder().setDescription(`Playlist command not found!`),
          ],
        });
        return;
    }
  },
  options: [
    {
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
    {
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
    {
      name: "list",
      description: "show guild's playlists",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
};

async function add(client, interaction) {
  const embed = new EmbedBuilder();

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

    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [embed.setDescription(`Playlist added successfully`)],
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [embed.setDescription(`Error adding playlist!`)],
    });
  }
}

async function remove(client, interaction) {
  const embed = new EmbedBuilder();

  const id = interaction.options.get("id").value;

  const playlist = await Playlist.findByIdAndDelete({ _id: id }).catch((e) => {
    console.log(e);
  });

  if (playlist) {
    return await interaction.reply({
      flags: MessageFlags.Ephemeral,
      embeds: [embed.setDescription(`Playlist removed successfully`)],
    });
  }

  return await interaction.reply({
    flags: MessageFlags.Ephemeral,
    embeds: [embed.setDescription(`Error removing playlist!`)],
  });
}

async function list(client, interaction) {
  const embed = new EmbedBuilder();

  let query = {
    guildId: interaction.guild.id,
  };

  const page = 1;
  const amount = 10;

  let count = await Playlist.countDocuments(query);
  let playlists = await Playlist.find(query)
    .sort({ _id: -1 })
    .skip((page - 1) * amount)
    .limit(amount);

  if (count > 0) {
    return await interaction.reply({
      embeds: await getPlaylistEmbeds(client, playlists),
      components: [getPaginator("playlist;list;", count, 1, amount)],
    });
  }

  return await interaction.reply({
    flags: MessageFlags.Ephemeral,
    embeds: [embed.setDescription("No playlists found!")],
  });
}
