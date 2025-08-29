import config from '../../../config.json' with { type: 'json' };
import getAutocompletes from '../../utils/getLocalAutocompletes.js';
import { MessageFlags, EmbedBuilder, Client } from 'discord.js';

/**
 *  @param {Client} client
 *  @param  interaction
*/
export default async (client, interaction) => {
  if(!interaction.isAutocomplete()) return;

  const autocompletes = await getAutocompletes();
  const autocomplete = autocompletes.find(cmd => {
    
    if(cmd.name !== interaction.commandName) return false;
    if(cmd.contexts && !cmd.contexts.includes(interaction.options.getSubcommand())) return false;
    
    return true;
  });

  if(!autocomplete) return;

  await autocomplete.callback(client, interaction);
}