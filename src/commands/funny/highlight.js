import {
  Client,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
  ChannelType,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

import HighlightGuild from "../../models/highlightGuild.js";

export default {
  name: "highlight",
  description: "immortalize a message with enough reactions",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "enable":
        await enable(client, interaction);
        break;
      case "disable":
        await disable(client, interaction);
        break;
      case "config":
        await config(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          content: `Dirty Word command not found!`,
        });
        return;
    }
  },
  options: [
    {
      name: "enable",
      description: "turn on the highlight feature",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "disable",
      description: "turn off the highlight feature",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
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
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
};

async function disable(client, interaction) {
  const words = await getLocalization(interaction.locale, `highlight`);

  let result = await HighlightGuild.updateOne(
    {
      guildId: interaction.guild.id,
    },
    {
      active: false,
    },
  );

  if (result.matchedCount === 0) {
    return await reply(interaction, words.NotConfigured);
  }

  return await reply(interaction, words.Disabled);
}

async function enable(client, interaction) {
  const words = await getLocalization(interaction.locale, `highlight`);
  let result = await HighlightGuild.updateOne(
    {
      guildId: interaction.guild.id,
    },
    {
      active: true,
    },
  );

  if (result.matchedCount === 0) {
    return await reply(interaction, words.NotConfigured);
  }

  return await reply(interaction, words.Enabled);
}

async function config(client, interaction) {
  const channel = interaction.options?.get("channel").value;
  let quantity = interaction.options?.get("quantity")?.value || 4;

  const words = await getLocalization(interaction.locale, `highlight`);

  let count = await HighlightGuild.countDocuments({
    guildId: interaction.guild.id,
  });

  if (count === 0) {
    await HighlightGuild.insertOne({
      guildId: interaction.guild.id,
      channelId: channel,
      count: quantity,
      active: true,
    });
  } else {
    await HighlightGuild.updateOne(
      {
        guildId: interaction.guild.id,
      },
      {
        channelId: channel,
        count: quantity,
        active: true,
      },
    );
  }

  return await reply(interaction, words.Enabled);
}

async function reply(interaction, message, ephemeral = true) {
  return await interaction.reply({
    flags: ephemeral ? [MessageFlags.Ephemeral] : [],
    embeds: [new EmbedBuilder().setDescription(message)],
  });
}
