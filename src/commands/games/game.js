import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Client,
  MessageFlags,
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export default {
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "search":
        await search(client, interaction);
        return;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          content: `Game command not found!`,
        });
        return;
    }
  },
  name: "game",
  description: "Command to search games // IGDB",
  options: [
    {
      name: "search",
      description: "tries to find a game",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "query",
          description: "the game name you want to search",
          type: ApplicationCommandOptionType.Number,
          required: true,
          autocomplete: true,
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
  const query = interaction.options?.get("query").value;

  if (
    query === -1 ||
    !process.env.IGDB_CLIENT_ID ||
    !client.igdb.access_token
  ) {
    interaction.reply(
      "Environment variable not defined, could not search for game!",
    );
    return;
  }

  const res = await fetch(`https://api.igdb.com/v4/games`, {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${client.igdb.access_token}`,
    },
    body: `fields name, summary, genres.*, keywords.*, first_release_date, involved_companies.company.*, cover.*, screenshots.*; limit 1; where id = ${query};`,
  });

  if (!res.ok) {
    console.log(games.statusText);
    interaction.reply("Game not found, try again later!");
    return;
  }

  const games = await res.json();

  if (!games) {
    interaction.reply("Game not found, try again later!");
    return;
  }

  const fields = [
    {
      name: "Keywords",
      value: (games[0].keywords.length > 10
        ? games[0].keywords.splice(0, 10)
        : games[0].keywords
      )
        .map((tag) => tag.name)
        .join(", "),
    },
    {
      name: "Release Date",
      value: new Date(games[0].first_release_date * 1000).toDateString(),
      inline: true,
    },
    {
      name: "Genres",
      value: games[0].genres.map((tag) => tag.name).join(", "),
      inline: true,
    },
    {
      name: "Companies",
      value: games[0].involved_companies
        .map((tag) => tag.company.name)
        .join(", "),
    },
  ];

  const embed = new EmbedBuilder()
    .setTitle(games[0].name)
    .setDescription(games[0].summary)
    .setFields(fields);

  if (games[0].cover) {
    embed.setThumbnail(
      `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${games[0].cover.image_id}.png`,
    );
  }

  if (games[0].screenshots) {
    embed.setImage(
      `https://images.igdb.com/igdb/image/upload/t_thumb_2x/${games[0].screenshots[0].image_id}.jpg`,
    );
  }

  interaction.reply({
    embeds: [embed],
  });
}
