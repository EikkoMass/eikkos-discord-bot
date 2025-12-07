import fs from "fs";
import path from "path";

const localInserts = [];

export default async (exceptions = []) => {
  if (localInserts.length > 0) return localInserts;

  const mainPath = path.join(import.meta.dirname, "..", "..", "inserts");
  const files = fs.readdirSync(mainPath);
  for (const file of files) {
    const insertObject = (await import(path.join(mainPath, file))).default;

    if (exceptions.includes(insertObject.name)) continue;

    localInserts.push(insertObject);
  }

  return localInserts;
};
