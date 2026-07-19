import actionTypes from "../configs/actionTypes.json" with { type: "json" };
import getLocal from "../utils/importers/getLocal.js";
import cache from "../cache/autocomplete.js";

const handler = async (client, interaction) => {
  const commandName = interaction.commandName;
  const group = interaction.options.getSubcommandGroup(false);
  const sub = interaction.options.getSubcommand(false);
  const focused = interaction.options.getFocused(true).name;

  const CACHE_REF = [commandName, group, sub, focused]
    .filter(Boolean)
    .join("$");

  let autocomplete = cache.get(CACHE_REF);

  if (!autocomplete) {
    if (cache.searched(CACHE_REF)) return;

    const autocompletes = await getLocal(actionTypes.autocompletes);

    autocomplete = autocompletes.find((cmd) => {
      if (cmd.name !== commandName) return false;

      return isValidAutoComplete(CACHE_REF, cmd.name, cmd);
    });

    cache.set(CACHE_REF, autocomplete);
  }

  if (!autocomplete) return;

  await autocomplete.callback(client, interaction);
};

function isValidAutoComplete(ref, builder, cmd) {
  let result = false;

  // /command abc [def] |   {name: command, contexts: [{ name: "abc", contexts: ["def"] }]}
  // /command [def]     |   {name: command, contexts: ["def"]}

  return (cmd.contexts || []).some((context) => {
    if (typeof context === "string") {
      result = `${builder}$${context}` === ref;
    }

    if (!result && typeof context === "object") {
      result = isValidAutoComplete(ref, `${builder}$${context.name}`, context);
    }

    if (result) return true;

    return false;
  });
}

export default handler;
