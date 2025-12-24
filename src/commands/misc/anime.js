import { Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

import { getLocalization } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };

const JIKAN_API_URL = "https://api.jikan.moe/v4";
const OPTS = {
  search: {
    name: "search",
    description: "Find the anime you want",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "query",
        description: "Anime search by name",
        type: ApplicationCommandOptionType.Integer,
        autocomplete: true,
        required: true,
      },
    ],
  },
  character: {
    name: "character",
    description: "Show the characters from the specified anime",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "query",
        description: "Anime search by name",
        type: ApplicationCommandOptionType.Integer,
        autocomplete: true,
        required: true,
      },
    ],
  },
};

export default {
  name: "anime",
  description: "Anime related commands",
  options: [OPTS.search, OPTS.character],

  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.search.name:
        return await search(client, interaction);
      case OPTS.character.name:
        return await character(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `Anime command not found!`,
        );
    }
  },
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function search(client, interaction) {
  const words = await getLocalization(interaction.locale, `anime`);

  let embed = new EmbedBuilder();
  const malId = interaction.options?.get("query").value;

  const res = await fetch(`${JIKAN_API_URL}/anime/${malId}`);

  if (!res.ok) {
    return await replies.message.error(interaction, words.SearchFailed);
  }

  const anime = await res.json();

  const fields = [
    { name: words.Status, value: anime.data.status, inline: true },
    { name: words.Type, value: anime.data.type, inline: true },
    { name: " ", value: " " },
    {
      name: words.Studios,
      value: anime.data.studios.map((studio) => studio.name).join(", "),
      inline: true,
    },
    {
      name: words.Genres,
      value: anime.data.genres.map((genre) => genre.name).join(", "),
      inline: true,
    },
  ];

  embed
    .setTitle(anime.data.title)
    .setURL(anime.data.url)
    .setThumbnail(anime.data.images.jpg.large_image_url)
    .setFields(fields)
    .setDescription(anime.data.synopsis);

  interaction.reply({
    embeds: [embed],
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function character(client, interaction) {
  const words = await getLocalization(interaction.locale, `anime`);

  const malId = interaction.options?.get("query").value;

  const res = await fetch(`${JIKAN_API_URL}/anime/${malId}/characters`);

  if (!res.ok) {
    return await replies.error.message(interaction, words.SearchFailed);
  }

  const anime = await res.json();
  anime.data = anime.data.slice(0, discord.embeds.max);

  const characters = [];

  for (let info of anime.data) {
    const fields = [
      { name: words.Role, value: info.role, inline: true },
      { name: words.Favorites, value: info.favorites.toString(), inline: true },
      {
        name: words.VoiceActor,
        value: info.voice_actors?.[0]?.person
          ? info.voice_actors[0].person.name
          : "N/A",
        inline: true,
      },
    ];

    const embed = new EmbedBuilder()
      .setTitle(info.character.name)
      .setURL(info.character.url)
      .setThumbnail(info.character.images.jpg.image_url)
      .setFields(fields);

    characters.push(embed);
  }

  interaction.reply({
    embeds: characters,
  });
}
