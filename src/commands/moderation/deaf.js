import { PermissionFlagsBits, ApplicationCommandOptionType, managerToFetchingStrategyOptions } from "discord.js";

import reply from "../../utils/core/replies.js";
import ms from "ms";

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
    description: "The duration of the penalty",
    type: ApplicationCommandOptionType.String,
    required: true,
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
    // const words = await getLocalization(interaction.locale, `deafen`);

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

  let condition = interaction.options.get("condition")?.value;
  let user = interaction.options.get("user").value;

  if (user) user = await interaction.guild.members.fetch(user);

  if(!user) return reply.message.error(interaction, `User not found!`);
  if (!user.voice?.channel) return reply.message.error(interaction, `User not in voice channel!`);

  user.voice.setDeaf(condition);

  return reply.message.success(
    interaction,
    "Modified with success"
  );

}

async function scheduleDeaf(client, interaction) {
  let duration = interaction.options.get("duration")?.value;
  let user = interaction.options.get("user").value;

  if (user) user = await interaction.guild.members.fetch(user);

  if(!user) return reply.message.error(interaction, `User not found!`);
  if (!user.voice) return reply.message.error(interaction, `User not in voice channel!`);

  let deaf = user.voice.deaf;

  user.voice.setDeaf(!deaf);
  const msTimeout = ms(duration);

  setTimeout(() => user.voice.setDeaf(deaf), msTimeout || 3000);

  return reply.message.success(
    interaction,
    "Modified with success"
  );
}
