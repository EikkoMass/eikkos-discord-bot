import { Client, ApplicationCommandOptionType } from "discord.js";
import Description from "../../models/description.js";

import reply from "../../utils/core/replies.js";

import { getLocalization, formatMessage } from "../../utils/i18n.js";

const OPTS = {
  for: {
    name: "for",
    description: "descriptions around about...",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "user",
        description: "Who will receive the description?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
    ],
  },
  register: {
    name: "register",
    description: "Register a description about someone.",
    type: ApplicationCommandOptionType.Subcommand,
    options: [
      {
        name: "user",
        description: "Who will receive the description?",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "message",
        description: "What is the description?",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },
};

export default {
  name: "description",
  description: "Add a private description about someone.",
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
          `description command not found!`,
        );
    }
  },
};

async function use(client, interaction) {
  const words = await getLocalization(interaction.locale, `description`);

  const targetUserId = interaction.options.get("user")?.value;

  let description = await Description.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
    targetUserId,
  });

  if (description?.message) {
    return await reply.message.base(
      interaction,
      description.message.replace("{user}", `<@${targetUserId}>`),
    );
  }

  return await reply.message.error(interaction, words.NoRegistered);
}

async function register(client, interaction) {
  const words = await getLocalization(interaction.locale, `description`);
  const message = interaction.options.get("message")?.value;
  const targetUserId = interaction.options.get("user")?.value;

  let description = await description.findOne({
    userId: interaction.member.id,
    guildId: interaction.guild.id,
    targetUserId,
  });

  if (description) {
    description.message = message;
  } else {
    description = new Description({
      userId: interaction.member.id,
      guildId: interaction.guild.id,
      targetUserId: targetUserId,
      message,
    });
  }

  await description.save();

  return await reply.message.success(
    interaction,
    formatMessage(words.Created, [interaction.member.id, targetUserId]),
  );
}
