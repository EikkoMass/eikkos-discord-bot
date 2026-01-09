import { ApplicationCommandOptionType, Client } from "discord.js";

import getRandomStream from "../../utils/components/getRandomStream.js";
import Stream from "../../models/stream.js";

import cache from "../../utils/cache/activity.js";
import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

export default {
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "register":
        await register(client, interaction);
        break;
      case "set":
        await set(client, interaction);
        break;
      case "remove":
        await remove(client, interaction);
        break;
      case "rotate":
        await rotate(client, interaction);
        break;
      default:
        return await reply.message.error(
          interaction,
          `Stream command not found!`,
        );
    }
  },
  name: "stream",
  description: "Manage links to bot stream",
  devOnly: true,
  options: [
    {
      name: "register",
      description: "Register an new stream option",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "title",
          description: "Title of the stream",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "link",
          description: "Link that you want to stream",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "priority",
          description:
            "Want to apply now the new stream? (don't work with rotation enabled)",
          type: ApplicationCommandOptionType.Boolean,
        },
      ],
    },
    {
      name: "set",
      description: "Set a new stream (without saving it // disables rotation)",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "title",
          description: "Title of the stream",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "link",
          description: "Link that you want to stream",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Remove the stream you want",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "link",
          description: "the link of the stream you want to remove",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "rotate",
      description: "Set the stream rotation state",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "active",
          description: "you want to rotate the bot stream?",
          type: ApplicationCommandOptionType.Boolean,
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
async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, `stream`);

  try {
    const title = interaction.options.get("title")?.value;
    const link = interaction.options.get("link")?.value;
    const priority = interaction.options.get("priority")?.value || false;

    let streamData = await Stream.findOne({
      link,
    });

    if (priority) {
      cache.set({
        name: title,
        url: link,
      });
    }

    if (streamData) {
      streamData.title = title;

      await streamData.save();
      return await reply.message.success(interaction, words.Edited);
    }

    streamData = new Stream({
      link,
      title,
    });

    await streamData.save();

    await reply.message.success(interaction, words.Registered);
  } catch (e) {
    console.log(e);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function set(client, interaction) {
  const words = await getLocalization(interaction.locale, `stream`);

  try {
    const title = interaction.options.get("title")?.value;
    const link = interaction.options.get("link")?.value;
    cache.setRotation(false);
    cache.set({
      name: title,
      url: link,
    });

    await reply.message.success(interaction, words.Registered);
  } catch (e) {
    console.log(e);
  }
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, `stream`);

  const link = interaction.options.get("link")?.value;

  let result = await Stream.findOneAndDelete({ link });

  if (result) {
    let current = cache.get();

    if (current.url === link) {
      let stream = await getRandomStream();

      if (stream) {
        cache.set({
          name: stream.title,
          url: stream.link,
        });
      } else {
        cache.set();
      }
    }

    return await reply.message.success(
      interaction,
      formatMessage(words.Removed, [result.title]),
    );
  }

  await reply.message.error(interaction, words.NotFound);
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function rotate(client, interaction) {
  const words = await getLocalization(interaction.locale, `stream`);

  const active = interaction.options.get("active")?.value;

  cache.setRotation(active);

  return await reply.message.success(
    interaction,
    formatMessage(words.ActiveUpdated),
  );
}
