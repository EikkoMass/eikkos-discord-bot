import path from "path";
import getAllFiles from "../getAllFiles.js";

export default async (context, exceptions = []) => {
  let actions = [];
  const files = getAllFiles(
    path.join(import.meta.dirname, "..", `actions/${context}`),
    false,
    true,
  );
  for (const file of files) {
    const actionObject = (await import(file)).default;

    if (exceptions.includes(actionObject.name)) continue;

    actions.push(actionObject);
  }

  return actions;
};
