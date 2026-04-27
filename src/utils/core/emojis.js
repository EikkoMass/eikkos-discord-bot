import config from "../../../config.json" with { type: "json" };
import masks from "./mask.js";

const emojis = (config || {}).emojis || {};

function get(key, alternative) {
  const emoji = emojis[key];

  if (!emoji) {
    console.log(`Emoji not found: ${key}`);
    return alternative ?? "❓";
  }

  return masks.emoji(emoji.name, emoji.id);
}

export default { get };
