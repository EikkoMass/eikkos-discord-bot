const {Client, Interaction} = require('discord.js');
const RoleContext = require('../../../models/roleContext');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = async (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'role') return;
    if(interaction.options.getSubcommand() !== 'remove' && interaction.options.getSubcommand() !== 'choose') return;

    const contexts = await RoleContext.find({ name: { $regex: '.*' + interaction.options.getFocused() + '.*' }, guildId: interaction.guild.id });

    interaction.respond([
      {name: 'None', value: ''},
      ...(contexts.map(context => { return { name: context.name, value: context._id.toString() }}))
    ]).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}