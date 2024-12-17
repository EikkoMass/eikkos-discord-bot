const {Client, Interaction} = require('discord.js');
const styles = require('../../../enums/buttonStyles');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'role') return;
    if(interaction.options.getSubcommand() !== 'add') return;

    interaction.respond(styles).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}