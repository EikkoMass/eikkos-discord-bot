const {Client, Interaction} = require('discord.js');
const { QueueRepeatMode } = require('discord-player');

  /**
   *  @param {Client} client
   *  @param {Interaction} interaction
  */
module.exports = (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'repeat') return;

    interaction.respond([
      {name: 'Current track', value: QueueRepeatMode.TRACK},
      {name: 'Entire queue', value: QueueRepeatMode.QUEUE},
      {name: 'Disable', value: QueueRepeatMode.OFF},
    ]).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}