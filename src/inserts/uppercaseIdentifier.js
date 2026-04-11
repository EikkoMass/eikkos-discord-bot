import { Client, Message } from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";

const PATTERN = /[a-zA-Z ]+/g;

export default {
  name: "uppercaseIdentifier",
  description: "asks to keep the voice down",

  type: "custom",
  match: (message) =>
    PATTERN.test(message.content) &&
    message.content.toUpperCase() == message.content,

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    if (getRandom() > 60) await message.reply("Keep your voice down! >_>");
  },
};
