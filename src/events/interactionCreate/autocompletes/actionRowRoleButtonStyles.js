import {Client} from 'discord.js';
import styles from '../../../enums/buttonStyles.js';

  /**
   *  @param {Client} client
   *  @param  interaction
  */
export default (client, interaction) => {
  try {
    if(!interaction.isAutocomplete()) return;
    if(interaction.commandName !== 'role') return;
    if(interaction.options.getSubcommand() !== 'add') return;

    interaction.respond(styles).catch(() => {});
  } catch (e) {
    console.log(e);
  }
}