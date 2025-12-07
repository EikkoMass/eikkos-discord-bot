import { Client } from "discord.js";

/**
 *
 * @param {Client} client
 * @param  interaction
 */
export default async (client, guildId) => {
  let applicationCommands;

  if (guildId) {
    // register the commands only in a specific guild
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    // register the commands in all included guilds
    applicationCommands = client.application.commands;
  }

  await applicationCommands.fetch();
  return applicationCommands;
};
