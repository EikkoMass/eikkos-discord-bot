import {
  ApplicationCommandOptionType,
  EmbedBuilder,
  MessageFlags,
  Colors,
} from "discord.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";
import discord from "../../configs/discord.json" with { type: "json" };

const SUSPENSE_TIMEOUT_MS = 3000;

const rolls = [4, 6, 8, 10, 12, 20, 100];
const maxValues = discord.embeds.max - 1;

const quantity = {
  name: "quantity",
  description: "How many dices you want to roll?",
  type: ApplicationCommandOptionType.Integer,
  max_value: maxValues,
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

  const res = await interaction.reply({
    embeds: [new EmbedBuilder().setDescription(words.CustomDiceReturns)],
    withResponse: true,
  });

  const message = await interaction.channel.messages.fetch(
    res.resource.message.id,
  );

  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  let rolls = [];
  let sum = 0;
  let maxSum = maxFloored * quantity;

  for (let i = 0; i < quantity; i++) {
    let randomized = Math.floor(
      Math.random() * (maxFloored - minCeiled + 1) + minCeiled,
    );

    sum += randomized;

    const layout = getLayout(randomized, maxFloored);

    rolls.push(
      new EmbedBuilder()
        .setDescription(`${layout.emoji} \` ${randomized} \``)
        .setColor(layout.color),
    );
  }

  setTimeout(
    () =>
      message.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${words.Roll} ${quantity}d${max}`)
            .setDescription(`📃 \` ${sum} \`/\` ${maxSum} \``)
            .setColor(getLayout(sum, maxSum).color),
          ...rolls,
        ],
      }),
    SUSPENSE_TIMEOUT_MS,
  );
}

async function roll(client, interaction) {
  const words = await getLocalization(interaction.locale, `roll`);

  const sub = interaction.options.getSubcommand();
  const quantity = interaction.options.get("quantity")?.value || 1;

  const res = await interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        formatMessage(words.DDiceReturns, [sub]),
      ),
    ],
    withResponse: true,
  });
  const maxFloored = Number.parseInt(sub.replace(/[^\d]+/g, ""));
  let rolls = [];
  let sum = 0;

  const message = await interaction.channel.messages.fetch(
    res.resource.message.id,
  );

  for (let i = 0; i < quantity; i++) {
    let randomized = Math.floor(Math.random() * maxFloored + 1);
    sum += randomized;

    const layout = getLayout(randomized, maxFloored);

    rolls.push(
      new EmbedBuilder()
        .setDescription(`${layout.emoji} \` ${randomized} \``)
        .setColor(layout.color),
    );
  }

  setTimeout(
    () =>
      message.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Roll ${quantity}d${maxFloored}`)
            .setDescription(`📃 \` ${sum} \`/\` ${maxFloored * quantity} \``)
            .setColor(getLayout(sum, maxFloored * quantity).color),
          ...rolls,
        ],
      }),
    SUSPENSE_TIMEOUT_MS,
  );
}

function getLayout(randomized, maxFloored) {
  const percentage = Math.floor((randomized / maxFloored) * 100);

  if (percentage < 33) {
    return {
      color: Colors.Red,
      emoji: ":skull:",
    };
  } else if (percentage >= 33 && percentage < 77) {
    return {
      color: Colors.Yellow,
      emoji: ":warning:",
    };
  } else {
    return {
      color: Colors.Green,
      emoji: ":white_check_mark:",
    };
  }
}
