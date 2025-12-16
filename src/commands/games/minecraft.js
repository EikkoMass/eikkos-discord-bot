import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  Client,
  MessageFlags,
} from "discord.js";
import MinecraftServer from "../../models/minecraftServer.js";
import editions from "../../enums/minecraft/editions.js";

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

export default {
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommandGroup()) {
      case "server":
        return await server(client, interaction);
      case "player":
        return await player(client, interaction);
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder().setDescription(`Minecraft command not found!`),
          ],
        });
        return;
    }
  },
  name: "minecraft",
  description: "Show info about the bot.",
  options: [
    {
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
    {
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
  ],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function register(client, interaction) {
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
      await interaction.reply({
        embeds: [
          new EmbedBuilder().setDescription(
            `Minecraft server register edited successfully!`,
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    server = new MinecraftServer({
      guildId: interaction.guild.id,
      address,
      edition,
      name,
    });
    await server.save();
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(
          `Minecraft server created successfully!`,
        ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  } catch (e) {
    console.log(e);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function status(client, interaction) {
  let server = await MinecraftServer.findOne({
    guildId: interaction.guild.id,
  });

  if (!server) {
    await interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [
        new EmbedBuilder().setDescription(
          `No minecraft server registered in this guild, create a new one with the command '/minecraft server register'.`,
        ),
      ],
    });
    return;
  }

  const path =
    server.edition === 1
      ? "https://api.mcsrvstat.us/3/"
      : "https://api.mcsrvstat.us/bedrock/3/";

  let res = await fetch(path + server.address);
  let serverInfo = await res.json();

  if (serverInfo.error) {
    console.log(serverInfo.error);
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Error on fetching server info!`),
      ],
      flags: [MessageFlags.Ephemeral],
    });
    return;
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
      name: "Status",
      value: serverInfo.online ? `🟢 Online` : `🔴 Offline`,
      inline: true,
    },
    { name: `Version`, value: serverInfo.version || "N/A", inline: true },
    { name: "Description", value: serverInfo.motd?.raw[0] || "None" },
    { name: "Address", value: server.address },
    {
      name: "Number of player",
      value: serverInfo.players
        ? `${serverInfo.players.online}/${serverInfo.players.max}`
        : "0/0",
      inline: true,
    },
    {
      name: `Edition`,
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
  switch (interaction.options.getSubcommand()) {
    case "status":
      return await status(client, interaction);
    case "register":
      return await register(client, interaction);
    default:
      await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder().setDescription(
            `Minecraft server command not found!`,
          ),
        ],
      });
      return;
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function player(client, interaction) {
  switch (interaction.options.getSubcommand()) {
    case "skin":
      return await skin(client, interaction);
    default:
      await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        embeds: [
          new EmbedBuilder().setDescription(
            `Minecraft player command not found!`,
          ),
        ],
      });
      return;
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function skin(client, interaction) {
  const query = interaction.options?.get("query").value || "";
  const name = query.split("/")[0];

  const res = await fetch(`https://playerdb.co/api/player/minecraft/${name}`);

  if (!res.ok) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(`Error on fetching player info!`),
      ],
      flags: [MessageFlags.Ephemeral],
    });
    return;
  }

  const json = await res.json();

  if (!json.success) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setDescription(
          `Could not find the player requested!`,
        ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
    return;
  }

  await interaction.reply(json.data.player.skin_texture);
}
