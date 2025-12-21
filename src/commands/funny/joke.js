import { Client, ApplicationCommandOptionType } from "discord.js";
import Joke from "../../models/joke.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const OPTS = {
  for: {
    name: "for",
    description: "jokes around about...",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "user",
        description: "Who will receive the joke?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  register: {
    name: "register",
    description: "Register a joke about someone.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "user",
        description: "Who will receive the joke?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "message",
        description: "What is the joke?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
};

export default {
  name: "joke",
  description: "Talk the joke you registered.",
  options: [OPTS.for, OPTS.register],

  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.for.name:
        return use(client, interaction);
      case OPTS.register.name:
        return register(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Joke command not found!`,
        );
    }
  },
};

async function use(client, interaction) {
  const words = await getLocalization(interaction.locale, `joke`);

  const targetUserId = interaction.options.get("user")?.value;

  let joke = await Joke.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
    targetUserId,
  });

  if (joke?.message) {
    return await reply.message.base(
      interaction,
      joke.message.replace("{user}", `<@${targetUserId}>`),
    );
  }

  return await reply.message.error(interaction, words.NoJokeRegistered);
}

async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, `joke`);
  const message = interaction.options.get("message")?.value;
  const targetUserId = interaction.options.get("user")?.value;

  let joke = await Joke.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
    targetUserId,
  });

  if (joke) {
    joke.message = message;
  } else {
    joke = new Joke({
      userId: interaction.member.id,
      guildId: interaction.guild.id,
      targetUserId: targetUserId,
      message,
    });
  }

  await joke.save();

  return await reply.message.success(
    interaction,
    formatMessage(words.JokeCreated, [interaction.member.id, targetUserId]),
  );
}
