import path from "path";
import getAllFiles from "../core/getAllFiles.js";

const actions = {};

export default async (context, exceptions = []) => {
  if (!actions[context]) actions[context] = [];
  if (actions[context].length > 0) return actions[context];

  const files = getAllFiles(
    path.join(import.meta.dirname, "..", "..", "actions", context),
    false,
    true,
  );
  for (const file of files) {
    const actionObject = (await import(file)).default;

    if (exceptions.includes(actionObject.name)) continue;

    actions[context].push(actionObject);
  }

  return actions[context];
};
