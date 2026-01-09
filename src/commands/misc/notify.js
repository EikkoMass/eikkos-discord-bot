import { Client, ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import Notify from "../../models/notify.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import replies from "../../utils/core/replies.js";
import discord from "../../configs/discord.json" with { type: "json" };
import getNotifyEmbeds from "../../utils/components/getNotifyEmbeds.js";
import getPaginator from "../../utils/components/getPaginator.js";

const OPTS = {
  add: {
    name: "add",
    description: "Add your notification",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "title",
        required: true,
        description: "The notification title",
        type: ApplicationCommandOptionType.String,
      },
      {
        name: "message",
        required: true,
        description: "The notification message you want to send",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },

  remove: {
    name: "remove",
    description: "Removes a role to the selection",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "id",
        required: true,
        description: "The id from your Notify register",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },

  show: {
    name: "show",
    description: "Shows the list of your saved Notify notifications",
    type: ApplicationCommandOptionType.Subcommand,
  },

  send: {
    name: "send",
    description: "the notification you want to send",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "title",
        description: "The saved notification you want",
        type: ApplicationCommandOptionType.String,
        autocomplete: true,
        required: true,
      },
    ],
  },
};

export default {
  name: "notify",
  description: "manage your Notify notifications",
  options: [OPTS.add, OPTS.send, OPTS.remove, OPTS.show],
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.add.name:
        return await add(client, interaction);
      case OPTS.remove.name:
        return await remove(client, interaction);
      case OPTS.show.name:
        return await show(client, interaction);
      case OPTS.send.name:
        return await send(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `Notify command not found!`,
        );
    }
  },
};

async function add(client, interaction) {
  const words = await getLocalization(interaction.locale, "notify");

  try {
    const title = interaction.options.get("title")?.value;
    const message = interaction.options.get("message")?.value;

    const notify = new Notify({
      title,
      message,
      guildId: interaction.guild.id,
      channelId: interaction.channel.id,
      userId: interaction.user.id,
      creationDate: Date.now(),
    });

    await notify.save();

    return await replies.message.success(
      interaction,
      formatMessage(words.Added, [title]),
    );
  } catch (e) {
    return await replies.message.error(
      interaction,
      formatMessage(words.ErrorAdding, [e.message]),
    );
  }
}

async function remove(client, interaction) {
  const words = await getLocalization(interaction.locale, "notify");

  try {
    const id = interaction.options.get("id")?.value;

    const notify = await Notify.findOneAndDelete({ _id: id });

    if (!notify) {
      return await replies.message.error(interaction, words.NotFound);
    }

    return await replies.message.success(
      interaction,
      formatMessage(words.Removed, [notify.title]),
    );
  } catch (e) {
    return await replies.message.error(
      interaction,
      formatMessage(words.ErrorRemoving, [id]),
    );
  }
}

async function show(client, interaction) {
  const words = await getLocalization(interaction.locale, "notify");

  try {
    const query = {
      guildId: interaction.guild.id,
    };

    const count = await Notify.countDocuments(query);
    const page = 1;

    const notify = await Notify.find(query)
      .sort({ _id: -1 })
      .skip((page - 1) * discord.embeds.max)
      .limit(discord.embeds.max);

    if (!notify || notify.length === 0) {
      return await replies.message.error(interaction, words.RegisterNotFound);
    }

    return await interaction.reply({
      embeds: await getNotifyEmbeds(client, notify),
      components: [
        getPaginator(
          {
            id: `notify;show;`,
          },
          count,
          page,
          discord.embeds.max,
        ),
      ],
    });
  } catch (e) {
    console.log(e);
    return await replies.message.error(interaction, words.ErrorShowing);
  }
}

async function send(client, interaction) {
  const words = await getLocalization(interaction.locale, "notify");
  const id = interaction.options.get("title")?.value;

  const notify = await Notify.findById(id);

  if (!notify || !notify.message) {
    return await replies.message.error(interaction, words.NotFound);
  }

  await interaction.deferReply();
  await interaction.deleteReply();

  interaction.channel.send(notify.message);
}
