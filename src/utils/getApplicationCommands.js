module.exports = async (client, guildId) => {
  let applicationCommands;

  if(guildId)
  { // register the commands only in a specific guild
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else 
  { // register the commands in all included guilds
    applicationCommands = await client.application.commands;
  }

  await applicationCommands.fetch();
  return applicationCommands;
}