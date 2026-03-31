import fs from "fs";
import path from "path";

const imports = {};

export default async (context, exceptions = []) => {
  if (imports[context]) return imports[context];

  imports[context] = [];

  const mainPath = path.join(import.meta.dirname, "..", "..", context);
  const files = fs.readdirSync(mainPath);
  for (const file of files) {
    const iFile = (await import(path.join(mainPath, file))).default;

    if (exceptions.includes(iFile.name)) continue;

    imports[context].push(iFile);
  }

  return imports[context];
};
