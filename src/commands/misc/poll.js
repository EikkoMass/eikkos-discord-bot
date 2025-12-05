import {
  PollLayoutType,
  Client,
  ApplicationCommandOptionType,
  MessageFlags,
} from "discord.js";

import reply from "../../utils/core/replies.js";

let polls = {};

export default {
  /**
   *
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case "create":
        await createPoll(client, interaction);
        break;
      case "finish":
        await finishPoll(client, interaction);
        break;
      default:
        return await reply.message.error(
          interaction,
          `Poll command not found!`,
        );
    }
  },
  options: [
    {
      name: "create",
      description: "Creates a new poll",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "question",
          description: `What question you want?`,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "choice1",
          description: `choice1`,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "choice2",
          description: `choice2`,
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "choice3",
          description: `choice3`,
          type: ApplicationCommandOptionType.String,
        },
        {
          name: "duration",
          description: `How much time you want to the poll exists?`,
          type: ApplicationCommandOptionType.Integer,
        },
      ],
    },
    {
      name: "finish",
      description: "Finish existing polls",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  name: "poll",
  description: "Manage polls",
};

async function createPoll(client, interaction) {
  const choice1 = interaction.options.get("choice1")?.value;
  const choice2 = interaction.options.get("choice2")?.value;
  const choice3 = interaction.options.get("choice3")?.value;

  const duration = interaction.options.get("duration")?.value || 2;

  const question = { text: interaction.options.get("question")?.value };

  const answers = [
    { text: choice1, emoji: "🤏" },
    { text: choice2, emoji: "🤖" },
  ];

  if (choice3) {
    answers.push({ text: choice3, emoji: "🧩" });
  }

  const message = await interaction.channel.send({
    poll: {
      question,
      answers,
      allowMultiselect: false,
      duration,
      layoutType: PollLayoutType.Default,
    },
  });

  if (!polls[interaction.guild.id]) {
    polls[interaction.guild.id] = [];
  }

  polls[interaction.guild.id].push(message.id);
  await reply.message.success(interaction, `Created a new poll!`);
}

async function finishPoll(client, interaction) {
  for (let id of polls[interaction.guild.id] || []) {
    let message = await interaction.channel.messages.fetch(id);
    if (message.poll) {
      if (message.poll.expiresTimestamp < Date.now()) continue;
      await message.poll.end();
    }
  }

  polls = [];

  await reply.message.success(interaction, `Finished pending polls!`);
}
