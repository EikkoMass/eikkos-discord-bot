import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  Colors,
} from "discord.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

import HighlightGuild from "../../models/highlightGuild.js";
import Highlight from "../../models/highlight.js";

import highlightGuildCache from "../../utils/cache/highlight-guild.js";

const OPTS = {
  enable: {
    name: "enable",
    description: "turn on the highlight feature",
    type: ApplicationCommandOptionType.Subcommand,
  },
  disable: {
    name: "disable",
    description: "turn off the highlight feature",
    type: ApplicationCommandOptionType.Subcommand,
  },
  config: {
    name: "config",
    description: "configurate the highlighting event",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "channel",
        description: "the channel to highlight messages in",
        type: ApplicationCommandOptionType.Channel,
        channel_types: [ChannelType.GuildText],
        required: true,
      },
      {
        name: "quantity",
        description: "amount of reactions to create the highlight (min 4)",
        type: ApplicationCommandOptionType.Integer,
        min_value: 4,
      },
    ],
  },
  status: {
    name: "status",
    description: "shows the status of the guild's highlights",
    type: ApplicationCommandOptionType.Subcommand,
  },
};

export default {
  name: "highlight",
  description: "immortalize a message with enough reactions",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.enable.name:
        return await enable(client, interaction);
      case OPTS.disable.name:
        return await disable(client, interaction);
      case OPTS.status.name:
        return await status(client, interaction);
      case OPTS.config.name:
        return await config(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Dirty Word command not found!`,
        );
    }
  },
  options: [OPTS.enable, OPTS.disable, OPTS.status, OPTS.config],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
};

async function disable(client, interaction) {
  const words = await getLocalization(interaction.locale, `highlight`);

  let result = await HighlightGuild.findOneAndUpdate(
    {
      guildId: interaction.guild.id,
    },
    {
      active: false,
    },
    {
      new: true,
      upsert: false,
    },
  );

  if (!result) {
    return await reply.message.error(interaction, words.NotConfigured);
  }

  highlightGuildCache.set(interaction.guild.id, result);
  return await reply.message.success(interaction, words.Disabled);
}

async function enable(client, interaction) {
  const words = await getLocalization(interaction.locale, `highlight`);
  let highlightGuild = await HighlightGuild.findOne({
    guildId: interaction.guild.id,
  });

  if (!highlightGuild) {
    return await reply.message.error(interaction, words.NotConfigured);
  }

  const channel = await interaction.guild.channels.fetch(
    highlightGuild.channelId,
  );

  if (!channel) {
    return await reply.message.error(interaction, words.MissingValidChannel);
  }

  highlightGuild.active = true;
  await highlightGuild.save();

  highlightGuildCache.set(interaction.guild.id, highlightGuild);
  return await reply.message.success(interaction, words.Enabled);
}

async function config(client, interaction) {
  const channel = interaction.options?.get("channel").value;
  let quantity = interaction.options?.get("quantity")?.value || 4;

  const words = await getLocalization(interaction.locale, `highlight`);

  let count = await HighlightGuild.countDocuments({
    guildId: interaction.guild.id,
  });

  let highlight;

  if (count === 0) {
    highlight = await HighlightGuild.insertOne({
      guildId: interaction.guild.id,
      channelId: channel,
      count: quantity,
      active: true,
    });
  } else {
    highlight = await HighlightGuild.findOneAndUpdate(
      {
        guildId: interaction.guild.id,
      },
      {
        channelId: channel,
        count: quantity,
        active: true,
      },
      {
        new: true,
        upsert: false,
      },
    );
  }

  highlightGuildCache.set(interaction.guild.id, highlight);

  return await reply.message.success(interaction, words.Enabled);
}

async function status(client, interaction) {
  const words = await getLocalization(interaction.locale, `highlight`);

  let guild = highlightGuildCache.get(interaction.guild.id);

  if (!guild) {
    guild = await HighlightGuild.findOne({
      guildId: interaction.guild.id,
    });

    highlightGuildCache.set(interaction.guild.id, guild);
  }

  let count = await Highlight.countDocuments({
    guildId: interaction.guild.id,
  });

  const embed = new EmbedBuilder();

  embed.setTitle(formatMessage(words.HighlightTitle, [interaction.guild.name]));
  embed.setThumbnail(interaction.guild.iconURL());
  embed.setFields([
    {
      name: words.Status,
      value: guild?.active ? words.Active : words.Inactive,
      inline: true,
    },
    {
      name: words.Quantity,
      value: guild ? count.toString() : "0",
      inline: true,
    },
    {
      name: " ",
      value: " ",
    },
    {
      name: words.Target,
      value: guild ? `<#${guild.channelId}>` : words.None,
      inline: true,
    },
    {
      name: words.Minimum,
      value: guild ? guild.count.toString() : "0",
      inline: true,
    },
  ]);

  if (guild?.active) {
    embed.setColor(Colors.Green);
  } else {
    embed.setColor(Colors.Red);
  }

  return await interaction.reply({
    embeds: [embed],
  });
}
