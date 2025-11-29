import {
  ApplicationCommandOptionType,
  Client,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
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
      case "remove":
        await remove(client, interaction);
        break;
      default:
        await reply.message.error(interaction, `Stream command not found!`);
        return;
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
          description: "How many dices you want to roll?",
          type: ApplicationCommandOptionType.Boolean,
        },
      ],
    },
    {
      name: "remove",
      description: "Sets a custom value to randomize",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "link",
          description: "Link that you want to stream",
          type: ApplicationCommandOptionType.String,
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
async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, `stream`);

  const link = interaction.options.get("link")?.value;

  let result = await Stream.findOneAndDelete({ link });

  if (result) {
    let current = cache.get();

    if (current.url === link) {
      let count = await Stream.countDocuments();

      let stream;

      if (count > 0) {
        stream = await Stream.findOne().skip(Math.floor(Math.random() * count));
      }

      if (stream) {
        cache.set({
          name: stream.title,
          url: stream.link,
        });
      } else {
        cache.set();
      }
    }

    await reply.message.success(
      interaction,
      formatMessage(words.Removed, [result.title]),
    );
    return;
  }

  await reply.message.error(interaction, words.NotFound);
}
