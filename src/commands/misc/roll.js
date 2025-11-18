import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const SUSPENSE_TIMEOUT_MS = 3000;

const rolls = [4, 6, 8, 10, 12, 20, 100];

const quantity = {
  name: "quantity",
  description: "How many dices you want to roll?",
  type: ApplicationCommandOptionType.Integer,
};

const getRollType = (amount) => {
  return {
    name: `d${amount}`,
    description: `Rolls a D${amount} dice`,
    type: ApplicationCommandOptionType.Subcommand,
    options: [quantity],
  };
};

const options = [
  {
    name: "custom",
    description: "Sets a custom value to randomize",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "min",
        description: "Min value to randomize 1 - n",
        type: ApplicationCommandOptionType.Integer,
      },
      {
        name: "max",
        description: "Max value to randomize n - 1.000.000",
        type: ApplicationCommandOptionType.Integer,
      },
      quantity,
    ],
  },
  ...rolls.map((roll) => getRollType(roll)),
];

export default {
  callback: async (client, interaction) => {
    if (interaction.options.getSubcommand() === "custom") {
      return await rollCustom(client, interaction);
    } else if (
      rolls.includes(
        parseInt(interaction.options.getSubcommand().replace("d", "")),
      )
    ) {
      return await roll(client, interaction);
    } else {
      return await interaction.reply({
        flags: [MessageFlags.Ephemeral],
        content: `Roll command not found!`,
      });
    }
  },
  name: "roll",
  description: "Get random numbers",
  options,
};

async function rollCustom(client, interaction) {
  const words = await getLocalization(interaction.locale, `roll`);

  let min = interaction.options.get("min")?.value;
  let max = interaction.options.get("max")?.value;

  const quantity = interaction.options.get("quantity")?.value || 1;

  min = min ? Number.parseInt(min) : 1;
  max = max ? Number.parseInt(max) : 1000000;

  await interaction.reply({
    embeds: [new EmbedBuilder().setDescription(words.CustomDiceReturns)],
  });

  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let result = null;

  for (let i = 0; i < quantity; i++) {
    let randomized = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );

    if (!result) {
      result = `${randomized}`;
      continue;
    }

    result += ` / ${randomized}`;
  }

  setTimeout(
    () =>
      interaction.channel.send({
        embeds: [new EmbedBuilder().setDescription(`:game_die: ${result}`)],
      }),
    SUSPENSE_TIMEOUT_MS,
  );
}

async function roll(client, interaction) {
  const words = await getLocalization(interaction.locale, `roll`);

  const sub = interaction.options.getSubcommand();
  const quantity = interaction.options.get("quantity")?.value || 1;
  let result = null;

  await interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        formatMessage(words.DDiceReturns, [sub]),
      ),
    ],
  });
  const maxFloored = Number.parseInt(sub.replace(/[^\d]+/g, ""));

  for (let i = 0; i < quantity; i++) {
    let randomized = Math.floor(Math.random() * maxFloored + 1);

    if (!result) {
      result = `${randomized}`;
      continue;
    }

    result += ` / ${randomized}`;
  }

  setTimeout(
    () =>
      interaction.channel.send({
        embeds: [new EmbedBuilder().setDescription(`:game_die: ${result}`)],
      }),
    SUSPENSE_TIMEOUT_MS,
  );
}
