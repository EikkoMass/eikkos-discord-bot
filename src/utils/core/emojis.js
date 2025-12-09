import config from "../../../config.json" with { type: "json" };

const emojis = (config || {}).emojis || {};

function get(key) {
  const emoji = emojis[key];

  if (!emoji) {
    console.log(`Emoji not found: ${key}`);
    return "❓";
  }

  return `<:${emoji.name}:${emoji.id}>`;
}

export default { get };
