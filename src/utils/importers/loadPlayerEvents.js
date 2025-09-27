import path from "path";
import getAllFiles from "../getAllFiles.js";

export default async (eventListener) => {
  const files = getAllFiles(
    path.join(import.meta.dirname, "..", "..", "playerEvents"),
  );

  if (!files) return;

  for (let file of files) {
    const event = (await import(file)).default;
    eventListener.on(event.name, event.callback);
  }
};
