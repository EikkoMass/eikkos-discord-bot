import getAutocompletes from "../../utils/importers/getLocalAutocompletes.js";
import cache from "../../utils/cache/autocomplete.js";
import { Client } from "discord.js";

/**
 *  @param {Client} client
 *  @param  interaction
 */
export default async (client, interaction) => {
  if (!interaction.isAutocomplete()) return;

  let autocomplete = cache.get(interaction.commandName);

  if (!autocomplete) {
    if (cache.searched(interaction.commandName)) return;

    const autocompletes = await getAutocompletes();

    autocomplete = autocompletes.find((cmd) => {
      if (cmd.name !== interaction.commandName) return false;
      if (
        cmd.contexts &&
        !cmd.contexts.includes(interaction.options.getSubcommand())
      )
        return false;

      return true;
    });

    cache.set(interaction.commandName, autocomplete);
  }

  if (!autocomplete) return;

  await autocomplete.callback(client, interaction);
};
