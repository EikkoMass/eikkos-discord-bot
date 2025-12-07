import path from "path";
import getAllFiles from "../core/getAllFiles.js";

const localContextMenus = [];

export default async (exceptions = []) => {
  if (localContextMenus.length > 0) return localContextMenus;

  const contextMenuCategories = getAllFiles(
    path.join(import.meta.dirname, "..", "..", "contextMenus"),
    true,
  );

  for (const contextMenuCategory of contextMenuCategories) {
    const contextMenuFiles = getAllFiles(contextMenuCategory);

    for (const contextMenuFile of contextMenuFiles) {
      const contextMenuObject = (await import(contextMenuFile)).default;

      if (exceptions.includes(contextMenuObject.name)) continue;

      localContextMenus.push(contextMenuObject);
    }
  }

  return localContextMenus;
};
