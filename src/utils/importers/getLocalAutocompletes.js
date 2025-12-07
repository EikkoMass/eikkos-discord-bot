import fs from "fs";
import path from "path";

const autocompletes = [];

export default async (exceptions = []) => {
  if (autocompletes.length > 0) return autocompletes;

  const mainPath = path.join(import.meta.dirname, "..", "..", "autocompletes");
  const files = fs.readdirSync(mainPath);
  for (const file of files) {
    const autocompleteObject = (await import(path.join(mainPath, file)))
      .default;

    if (exceptions.includes(autocompleteObject.name)) continue;

    autocompletes.push(autocompleteObject);
  }

  return autocompletes;
};
