import fs from "fs";
import path from "path";

const imports = {};

async function getLocal(context, exceptions = [], cache = true) {
  if (cache && imports[context]) return imports[context];
  const CACHE_REF = context.split(path.sep)[0];

  const mainPath = path.join(import.meta.dirname, "..", "..", context);
  const files = fs.readdirSync(mainPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await getLocal(path.join(context, file.name), exceptions, false);
    } else {
      await iimport(path.join(mainPath, file.name), context, exceptions);
    }
  }

  return imports[CACHE_REF];
}

async function iimport(filePath, context, exceptions) {
  const iFile = (await import(filePath)).default;

  if (exceptions.includes(iFile.name)) return;

  const CACHE_REF = context.split(path.sep)[0];
  if (!imports[CACHE_REF]) imports[CACHE_REF] = [];
  imports[CACHE_REF].push(iFile);
}

export default getLocal;
