import {
  Client,
  ApplicationCommandOptionType,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";

import { randomize } from "../../utils/core/randomize.js";

export default {
  name: "affinity",
  description: "Calculate the affinity (love / hate) between 2 users",
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "love":
        await love(client, interaction);
        break;
      case "hate":
        await hate(client, interaction);
        break;
      default:
        await interaction.reply({
          flags: [MessageFlags.Ephemeral],
          content: `Affinity command not found!`,
        });
        return;
    }
  },

  options: [
    {
      name: "love",
      description: "How much love they share",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "first",
          description: "The first user you want to match",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "second",
          description: "The second user you want to match",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ],
    },
    {
      name: "hate",
      description: "How much they want to crush each other apart",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "first",
          description: "The first user you want to match",
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: "second",
          description: "The second user you want to match",
          type: ApplicationCommandOptionType.User,
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
async function love(client, interaction) {
  const user1 = interaction.options?.get("first").value;
  const user2 = interaction.options?.get("second").value;

  const results = affinityCalc(
    "love",
    Number.parseInt(user1),
    Number.parseInt(user2),
  );

  let embed = new EmbedBuilder()
    .setTitle("Love percentage")
    .setDescription(
      `<@${user1}> level of love with <@${user2}> is : ${results.percentage}%\n\n${results.level}`,
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
  const user1 = interaction.options?.get("first").value;
  const user2 = interaction.options?.get("second").value;

  const results = affinityCalc(
    "hate",
    Number.parseInt(user1),
    Number.parseInt(user2),
  );

  let embed = new EmbedBuilder()
    .setTitle("Hate percentage")
    .setDescription(
      `<@${user1}> level of hate with <@${user2}> is : ${results.percentage}%\n\n${results.level}`,
    );

  interaction.reply({
    embeds: [embed],
  });
}

function affinityCalc(type, user1, user2) {
  const affinityEmojis = {
    love: {
      filled: ":heart:",
      empty: ":black_heart:",
    },
    hate: {
      filled: ":broken_heart:",
      empty: ":black_heart:",
    },
  };

  const emojis = affinityEmojis[type];

  let affinity = Math.round(randomize(user1 + user2) * 100);

  if (type === "hate") {
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
