import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Client,
  MessageFlags,
} from "discord.js";
import MinecraftServer from "../../models/minecraftServer.js";
import editions from "../../enums/minecraft/editions.js";

import { getLocalization } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";

const editionDictionary = [
  {
    name: "Java",
    value: editions.JAVA,
  },
  {
    name: "Bedrock",
    value: editions.BEDROCK,
  },
];

const OPTS = {
  server: {
    name: "server",
    description: "Info about the server registered to the guild",
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [
      {
        name: "status",
        description: "Info about the server registered to the guild",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "register",
        description: "Insert / Edit a server you want to see info about",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "address",
            description:
              "Server address you want to register, example: myserver.play.io",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "edition",
            description: "What's the server edition?",
            type: ApplicationCommandOptionType.Integer,
            required: true,
            autocomplete: true,
          },
          {
            name: "name",
            description: "Server's name",
            type: ApplicationCommandOptionType.String,
          },
        ],
      },
    ],
  },
  player: {
    name: "player",
    description: "Info about the server registered to the guild",
    type: ApplicationCommandOptionType.SubcommandGroup,
    options: [
      {
        name: "skin",
        description: "Get the player skin",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "query",
            description: "The player name",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },
};

export default {
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case OPTS.server.name:
        return await server(client, interaction);
      case OPTS.player.name:
        return await player(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `Minecraft command not found!`,
        );
    }
  },
  name: "minecraft",
  description: "Show info about the bot.",
  options: [OPTS.server, OPTS.player],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, "minecraft");

  try {
    const name = interaction.options.get("name")?.value;
    const address = interaction.options.get("address")?.value;
    const edition = interaction.options.get("edition")?.value;

    let server = await MinecraftServer.findOne({
      guildId: interaction.guild.id,
    });

    if (server) {
      server.address = address;
      server.edition = edition;
      server.name = name || server.name;

      await server.save();
      return await replies.message.success(
        interaction,
        words.EditedSuccessfully,
      );
    }

    server = new MinecraftServer({
      guildId: interaction.guild.id,
      address,
      edition,
      name,
    });
    await server.save();
    return await replies.message.success(
      interaction,
      words.CreatedSuccessfully,
    );
  } catch (e) {
    console.log(e);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function status(client, interaction) {
  const words = await getLocalization(interaction.locale, "minecraft");

  let server = await MinecraftServer.findOne({
    guildId: interaction.guild.id,
  });

  if (!server) {
    return await replies.message.error(interaction, words.MissingServer);
  }

  const path =
    server.edition === 1
      ? "https://api.mcsrvstat.us/3/"
      : "https://api.mcsrvstat.us/bedrock/3/";

  let res = await fetch(path + server.address);
  let serverInfo = await res.json();

  if (serverInfo.error) {
    console.log(serverInfo.error);
    return await replies.message.error(interaction, words.ErrorFetchingServer);
  }

  let attachment = null;

  if (serverInfo.icon) {
    attachment = Buffer.from(serverInfo.icon.split(",")[1], "base64");
  } else {
    let defaultNoneImg = await fetch(
      "https://minecraft-api.vercel.app/images/blocks/grass_block.png",
    );
    attachment = Buffer.from(await defaultNoneImg.arrayBuffer());
  }

  const infoFields = [
    {
      name: words.Status,
      value: serverInfo.online ? `🟢 Online` : `🔴 Offline`,
      inline: true,
    },
    { name: words.Version, value: serverInfo.version || "N/A", inline: true },
    { name: words.Description, value: serverInfo.motd?.raw[0] || "None" },
    { name: words.Address, value: server.address },
    {
      name: words.NumberPlayers,
      value: serverInfo.players
        ? `${serverInfo.players.online}/${serverInfo.players.max}`
        : "0/0",
      inline: true,
    },
    {
      name: words.Edition,
      value:
        editionDictionary.find((edition) => edition.value === server.edition)
          ?.name || "Not found",
      inline: true,
    },
  ];

  const embed = new EmbedBuilder()
    .setThumbnail(`attachment://icon.png`)
    .setTitle(server.name || "Minecraft Server")
    .setColor("Random")
    .addFields(infoFields);

  await interaction.reply({
    embeds: [embed],
    files: [{ attachment, name: `icon.png` }],
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function server(client, interaction) {
  const words = await getLocalization(interaction.locale, "minecraft");

  switch (interaction.options.getSubcommand()) {
    case "status":
      return await status(client, interaction);
    case "register":
      return await register(client, interaction);
    default:
      return await replies.message.error(
        interaction,
        words.ServerCommandNotFound,
      );
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function player(client, interaction) {
  const words = await getLocalization(interaction.locale, "minecraft");

  switch (interaction.options.getSubcommand()) {
    case "skin":
      return await skin(client, interaction);
    default:
      return await replies.message.error(
        interaction,
        words.PlayerCommandNotFound,
      );
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function skin(client, interaction) {
  const words = await getLocalization(interaction.locale, "minecraft");

  const query = interaction.options?.get("query").value || "";
  const name = query.split("/")[0];

  const res = await fetch(`https://playerdb.co/api/player/minecraft/${name}`);

  if (!res.ok) {
    return await replies.message.error(interaction, words.ErrorFetching);
  }

  const json = await res.json();

  if (!json.success) {
    return await replies.message.error(interaction, words.PlayerNotFound);
  }

  await interaction.reply(json.data.player.skin_texture);
}
