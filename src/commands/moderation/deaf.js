import { PermissionFlagsBits, ApplicationCommandOptionType, managerToFetchingStrategyOptions } from "discord.js";

import reply from "../../utils/core/replies.js";

const DEFAULT_DURATION = 3000;

const setOpts = [
  {
    name: "condition",
    description: "The condition to set",
    type: ApplicationCommandOptionType.Boolean,
    required: true,
  },
  {
    name: "user",
    description: "The user to deafen",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
];

const scheduleOpts = [
  {
    name: "user",
    description: "The user to deafen",
    type: ApplicationCommandOptionType.User,
    required: true,
  },
  {
    name: "duration",
    description: "The duration of the penalty (in seconds)",
    type: ApplicationCommandOptionType.Integer,
    required: true
  },
];

const OPTS = {
  set: {
    name: "set",
    description: "Sets directly to deafened",
    type: ApplicationCommandOptionType.Subcommand,
    options: setOpts
  },
  schedule: {
    name: "schedule",
    description: "Schedules a penalty time",
    type: ApplicationCommandOptionType.Subcommand,
    options: scheduleOpts,
  },
}

export default {
  name: "deafen",
  testOnly: true,
  description: "Deafen a user",
  /**
   *  @param {Client} client
   *  @param  interaction
   */
  callback: async (client, interaction) => {
    switch (interaction.options.getSubcommand()) {
      case OPTS.set.name:
        return await setDeaf(client, interaction);
      case OPTS.schedule.name:
        return await scheduleDeaf(client, interaction);
      default:
        return await reply.message.error(
          interaction,
          `Deafen command not found!`,
        );
    }
  },

  options: [OPTS.schedule, OPTS.set],
  botPermissions: [PermissionFlagsBits.DeafenMembers],
};

async function setDeaf(client, interaction) {

  const words = await getLocalization(interaction.locale, `deaf`);

  let condition = interaction.options.get("condition")?.value;
  let user = interaction.options.get("user").value;

  if (user) user = await interaction.guild.members.fetch(user);

  if(!user) return reply.message.error(interaction, words.NotFound);
  if (!user.voice?.channel) return reply.message.error(interaction, words.NotInVC);

  user.voice.setDeaf(condition);

  return reply.message.success(
    interaction,
    words.UpdatedSuccessfully
  );

}

async function scheduleDeaf(client, interaction) {
  let duration = interaction.options.get("duration")?.value;
  let user = interaction.options.get("user").value;

  if (user) user = await interaction.guild.members.fetch(user);
  if (duration) duration *= 1000;

  if(!user) return reply.message.error(interaction, words.NotFound);
  if (!user.voice) return reply.message.error(interaction, words.NotInVC);

  let deaf = user.voice.deaf;

  user.voice.setDeaf(!deaf);

  setTimeout(() => user.voice.setDeaf(deaf), duration || DEFAULT_DURATION);

  return reply.message.success(
    interaction,
    words.UpdatedSuccessfully
  );
}
