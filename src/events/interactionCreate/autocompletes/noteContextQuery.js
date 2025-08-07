const { Client, Interaction } = require('discord.js');
const types = require('../../../enums/noteContextTypes');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'notes') return;
    if(!['add', 'show'].includes(interaction.options.getSubcommand())) return;

    interaction.respond(types).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}