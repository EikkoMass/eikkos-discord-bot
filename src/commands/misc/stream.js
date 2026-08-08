import { ApplicationCommandOptionType, Client } from "discord.js";

import getRandomStatus from "../../utils/components/getRandomStatus.js";
import Status from "../../models/status.js";

import cache from "../../cache/activity.js";
import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const OPTS = {
  register: {
    name: "register",
    description: "Register an new status option",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "title",
        description: "Title of the status",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "link",
        description: "Link that you want to status",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "priority",
        description:
          "Want to apply now the new status? (don't work with rotation enabled)",
        type: ApplicationCommandOptionType.Boolean,
      },
    ],
  },
  set: {
    name: "set",
    description: "Set a new status (without saving it // disables rotation)",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "title",
        description: "Title of the status",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: "link",
        description: "Link that you want to show on the status",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  remove: {
    name: "remove",
    description: "Remove the status you want",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "link",
        description: "the link of the status you want to remove",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
  rotate: {
    name: "rotate",
    description: "Set the status rotation state",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "active",
        description: "you want to rotate the bot status?",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
      },
    ],
  },
};

export default {
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.register.name:
        return await register(client, interaction);
      case OPTS.set.name:
        return await set(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      case OPTS.rotate.name:
        return await rotate(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Status command not found!`,
        );
    }
  },
  name: "status",
  description: "Manage links to bot status",
  devOnly: true,
  options: [OPTS.register, OPTS.set, OPTS.remove, OPTS.rotate],
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, `status`);

  try {
    const title = interaction.options.get("title")?.value;
    const link = interaction.options.get("link")?.value;
    const priority = interaction.options.get("priority")?.value || false;

    let data = await Status.findOne({
      link,
    });

    if (priority) {
      cache.set({
        name: title,
        url: link,
      });
    }

    if (data) {
      data.title = title;

      await data.save();
      return await reply.message.success(interaction, words.Edited);
    }

    data = new Status({
      link,
      title,
    });

    await data.save();

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
  const words = await getLocalization(interaction.locale, `status`);

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
  const words = await getLocalization(interaction.locale, `status`);

  const link = interaction.options.get("link")?.value;

  let result = await Status.findOneAndDelete({ link });

  if (result) {
    let current = cache.get();

    if (current.url === link) {
      let status = await getRandomStatus();

      if (status) {
        cache.set({
          name: status.title,
          url: status.link,
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
  const words = await getLocalization(interaction.locale, `status`);

  const active = interaction.options.get("active")?.value;

  cache.setRotation(active);

  return await reply.message.success(
    interaction,
    formatMessage(words.ActiveUpdated),
  );
}
