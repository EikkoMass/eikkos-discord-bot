const {Client, Interaction} = require('discord.js');
const editions = require('../../enums/minecraftEditions');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'minecraft') return;
    if(interaction.options.getSubcommand() !== 'register') return;

    interaction.respond(editions).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}