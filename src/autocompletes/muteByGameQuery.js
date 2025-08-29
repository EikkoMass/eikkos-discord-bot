import {Client} from 'discord.js';


export default {
  name: 'mute-by-game',

  /**
   *  @param {Client} client
   *  @param  interaction
  */
  callback: (client, interaction) => {
    try {
      interaction.respond([
        {name: 'League Of Legends', value: 'League of Legends'},
        {name: 'WEBFISHING', value: 'WEBFISHING'},
        {name: 'Balatro', value: 'Balatro'},
      ]).catch(() => {});
    } catch (e) {
      console.log(e);
    }
  }
}