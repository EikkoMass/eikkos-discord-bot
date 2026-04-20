import actionTypes from "../configs/actionTypes.json" with { type: "json" };
import getLocal from "../utils/importers/getLocal.js";
import cache from "../utils/cache/autocomplete.js";

const handler = async (client, interaction) => {
  let autocomplete = cache.get(interaction.commandName);

  if (!autocomplete) {
    if (cache.searched(interaction.commandName)) return;

    const autocompletes = await getLocal(actionTypes.autocompletes);

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

export default handler;
