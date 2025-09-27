import fs from "fs";
import path from "path";

export default async (exceptions = []) => {
  let localInserts = [];
  const mainPath = path.join(import.meta.dirname, "..", "..", "inserts");
  const files = fs.readdirSync(mainPath);
  for (const file of files) {
    const insertObject = (await import(`${mainPath}/${file}`)).default;

    if (exceptions.includes(insertObject.name)) continue;

    localInserts.push(insertObject);
  }

  return localInserts;
};
