import {
  Client,
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import ms from "ms";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const remindersCache = {};

export default {
  name: "reminder",
  description: "Reminds you something later.",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "create":
        await create(client, interaction);
        break;
      case "status":
        await status(client, interaction);
        break;
      case "cancel":
        await cancel(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          content: `Reminder command not found!`,
        });
        return;
    }
  },

  options: [
    {
      name: "create",
      description: "creates a new reminder",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "time",
          description: "the time out to remind (30 minutes , 1 hour , 1 day)",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "message",
          description: "What you want to remind?",
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "user",
          description: "Who will receive the message?",
          type: ApplicationCommandOptionType.User,
        },
      ],
    },
    {
      name: "status",
      description: "show a list of your current reminders",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "cancel",
      description: "Cancel an active reminder",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "id",
          description: "The id of the pending reminder",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
  ],
};

async function create(client, interaction) {
  const words = await getLocalization(interaction.locale, `remind`);

  let time = interaction.options.get("time")?.value;
  const message = interaction.options.get("message")?.value || "";
  const user = interaction.options.get("user")?.value;
  let receiver = interaction.member;

  time = time
    .replaceAll(words.Seconds, "seconds")
    .replaceAll(words.Second, "second")

    .replaceAll(words.Minutes, "minutes")
    .replaceAll(words.Minute, "minute")

    .replaceAll(words.Hours, "hours")
    .replaceAll(words.Hour, "hour");

  if (user) {
    receiver = await interaction.guild.members.fetch(user);
  }

  const duration = ms(time);
  const { default: prettyMs } = await import("pretty-ms");

  const formattedDuration = prettyMs(duration, { verbose: true });

  interaction.reply({
    flags: [MessageFlags.Ephemeral],
    content: formatMessage(words.Ping, [formattedDuration]),
  });

  const embed = new EmbedBuilder();

  embed.setDescription(message || " ").setFooter({
    iconURL: interaction.member.displayAvatarURL({ size: 256 }),
    text: formatMessage(words.EventHistory, [
      interaction.member.displayName || interaction.member.nickname,
      formattedDuration,
    ]),
  });

  const cacheIdentifier = `${interaction.member.id}$${interaction.guild.id}`;
  const generatedId = Math.random().toString(36).replace("0.", "");

  (function () {
    const timeoutId = setTimeout(() => {
      interaction.channel.send({
        content: `<@${receiver.id}>`,
        embeds: [embed],
      });

      remindersCache[cacheIdentifier].splice(
        remindersCache[cacheIdentifier].findIndex(
          (cache) => cache.id === generatedId,
        ),
        1,
      );
    }, Number.parseInt(duration));

    if (!Array.isArray(remindersCache[cacheIdentifier]))
      remindersCache[cacheIdentifier] = [];
    remindersCache[cacheIdentifier].push({
      id: generatedId,
      timeoutId,
      message,
      receiver,
    });
  })();
}

async function status(client, interaction) {
  const words = await getLocalization(interaction.locale, `remind`);

  const embeds = [];
  const cacheIdentifier = `${interaction.member.id}$${interaction.guild.id}`;

  if (
    !Array.isArray(remindersCache[cacheIdentifier]) ||
    !remindersCache[cacheIdentifier].length
  ) {
    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [new EmbedBuilder().setDescription(words.NotFound)],
    });
    return;
  }

  for (let reminder of remindersCache[cacheIdentifier]) {
    const user = reminder.receiver.user;
    const embed = new EmbedBuilder()
      .setTitle(`${words.To}: ${user.displayName || user.nickname}`)
      .setFooter({ text: `ID: ${reminder.id}` });

    if (reminder.message) {
      embed.setDescription(reminder.message);
    }

    embeds.push(embed);
  }

  interaction.reply({
    flags: [MessageFlags.Ephemeral],
    embeds,
  });
}

async function cancel(client, interaction) {
  const words = await getLocalization(interaction.locale, `remind`);

  let id = interaction.options.get("id")?.value;
  const cacheIdentifier = `${interaction.member.id}$${interaction.guild.id}`;

  if (!Array.isArray(remindersCache[cacheIdentifier])) {
    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [new EmbedBuilder().setDescription(words.NotFound)],
    });
    return;
  }

  let index = remindersCache[cacheIdentifier].findIndex(
    (cache) => cache.id === id,
  );

  if (index < 0) {
    interaction.reply({
      flags: [MessageFlags.Ephemeral],
      embeds: [new EmbedBuilder().setDescription(words.NotFoundSpecified)],
    });
    return;
  }

  clearTimeout(remindersCache[cacheIdentifier][index].timeoutId);
  remindersCache[cacheIdentifier].splice(index, 1);

  interaction.reply({
    flags: [MessageFlags.Ephemeral],
    embeds: [new EmbedBuilder().setDescription(words.Cancelled)],
  });
}
