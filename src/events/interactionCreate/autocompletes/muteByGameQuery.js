import {Client} from 'discord.js';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'mute-by-game') return;

    interaction.respond([
      {name: 'League Of Legends', value: 'League of Legends'},
      {name: 'WEBFISHING', value: 'WEBFISHING'},
      {name: 'Balatro', value: 'Balatro'},
    ]).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}