const {Client, Interaction} = require('discord.js');
const types = require('../../../enums/dirtyWordTypes');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'dirty-word') return;
    if(interaction.options.getSubcommand() !== 'register') return;

    interaction.respond(types).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}