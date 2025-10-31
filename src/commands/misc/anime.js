import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

import { getLocalization } from "../../utils/i18n.js";

export default {
  name: "anime",
  description: "Anime related commands",
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "search":
        await search(client, interaction);
        break;
      case "character":
        await character(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder().setDescription(`Anime command not found!`),
          ],
        });
        return;
    }
  },

  options: [
    {
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
    {
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
  ],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function search(client, interaction) {
  const words = await getLocalization(interaction.locale, `anime`);

  let embed = new EmbedBuilder();
  const malId = interaction.options?.get("query").value;

  const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);

  if (!res.ok) {
    interaction.reply({
      embeds: [embed.setDescription(words.SearchFailed)],
    });
    return;
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
  const CHARACTER_LIMIT = 10;

  let embed = new EmbedBuilder();
  const malId = interaction.options?.get("query").value;

  const res = await fetch(`https://api.jikan.moe/v4/anime/${malId}/characters`);

  if (!res.ok) {
    interaction.reply({
      embeds: [embed.setDescription(words.SearchFailed)],
    });
    return;
  }

  const anime = await res.json();
  anime.data = anime.data.slice(0, CHARACTER_LIMIT);

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
