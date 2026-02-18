import config from "../../../config.json" with { type: "json" };

const emojis = (config || {}).emojis || {};

function get(key, alternative) {
  const emoji = emojis[key];

  if (!emoji) {
    console.log(`Emoji not found: ${key}`);
    return alternative ?? "❓";
  }

  return `<:${emoji.name}:${emoji.id}>`;
}

export default { get };
