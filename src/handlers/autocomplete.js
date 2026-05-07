import actionTypes from "../configs/actionTypes.json" with { type: "json" };
import getLocal from "../utils/importers/getLocal.js";
import cache from "../utils/cache/autocomplete.js";

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

      const contexts = cmd.contexts || [];

      const singleContext = contexts.filter((el) => !Array.isArray(el));
      const subContexts = contexts.filter((el) => Array.isArray(el));

      if (
        isInvalidAutoCompletePath(singleContext, { sub, focused, group }) &&
        (!subContexts ||
          subContexts.every((el) =>
            isInvalidAutoCompletePath(el, { sub, focused, group }),
          ))
      ) {
        return false;
      }

      return true;
    });

    cache.set(CACHE_REF, autocomplete);
  }

  if (!autocomplete) return;

  await autocomplete.callback(client, interaction);
};

function isInvalidAutoCompletePath(context, tree) {
  return (
    context &&
    (!context.includes(tree.sub) ||
      !context.includes(tree.focused) ||
      (tree.group !== null && !context.includes(tree.group)))
  );
}

export default handler;
