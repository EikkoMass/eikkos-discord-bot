import {
  Client,
  ApplicationCommandOptionType,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import { randomize } from "../../utils/core/randomizer.js";

import replies from "../../utils/core/replies.js";

const SUBOPTS = {
  first: {
    name: "first",
    description: "The first user you want to match",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
  second: {
    name: "second",
    description: "The second user you want to match",
    type: ApplicationCommandOptionType.User,
  },
};

const OPTS = {
  love: {
    name: "love",
    description: "How much love they share",
    type: ApplicationCommandOptionType.Subcommand,
    options: [SUBOPTS.first, SUBOPTS.second],
  },
  hate: {
    name: "hate",
    description: "How much they want to crush each other apart",
    type: ApplicationCommandOptionType.Subcommand,
    options: [SUBOPTS.first, SUBOPTS.second],
  },
};

export default {
  name: "affinity",
  description: "Calculate the affinity (love / hate) between 2 users",
  options: [OPTS.love, OPTS.hate],

  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.love.name:
        return await love(client, interaction);
      case OPTS.hate.name:
        return await hate(client, interaction);
      default:
        return await replies.message.error(
          interaction,
          `Affinity command not found!`,
        );
    }
  },
};

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function love(client, interaction) {
  const words = await getLocalization(interaction.locale, `affinity`);

  const user1 = interaction.options?.get("first").value;
  const user2 =
    interaction.options?.get("second")?.value || interaction.user.id;

  const results = affinityCalc(
    OPTS.love.name,
    Number.parseInt(user1),
    Number.parseInt(user2),
  );

  let embed = new EmbedBuilder()
    .setTitle("Love percentage")
    .setDescription(
      formatMessage(words.LoveLevel, [
        user1,
        user2,
        results.percentage,
        results.level,
      ]),
    );

  interaction.reply({
    embeds: [embed],
  });
}

/**
 *  @param {Client} client
 *  @param  interaction
 */
async function hate(client, interaction) {
  const words = await getLocalization(interaction.locale, `affinity`);

  const user1 = interaction.options?.get("first").value;
  const user2 =
    interaction.options?.get("second")?.value || interaction.user.id;

  const results = affinityCalc(
    OPTS.hate.name,
    Number.parseInt(user1),
    Number.parseInt(user2),
  );

  let embed = new EmbedBuilder()
    .setTitle("Hate percentage")
    .setDescription(
      formatMessage(words.HateLevel, [
        user1,
        user2,
        results.percentage,
        results.level,
      ]),
    );

  interaction.reply({
    embeds: [embed],
  });
}

function affinityCalc(type, user1, user2) {
  const affinityEmojis = {
    [`${OPTS.love.name}`]: {
      filled: ":heart:",
      empty: ":black_heart:",
    },
    [`${OPTS.hate.name}`]: {
      filled: ":broken_heart:",
      empty: ":black_heart:",
    },
  };

  const emojis = affinityEmojis[type];

  let affinity = Math.round(randomize(user1 + user2) * 100);

  if (type === OPTS.hate.name) {
    affinity = 100 - affinity;
  }

  let affinityIndex = Math.floor(affinity / 10);
  let affinityLevel =
    emojis.filled.repeat(affinityIndex) +
    emojis.empty.repeat(10 - affinityIndex);

  return {
    percentage: affinity,
    index: affinityIndex,
    level: affinityLevel,
  };
}
