import { Client, Message } from "discord.js";
import { getRandomNumber } from "../utils/core/randomizer.js";

export default {
  name: "uppercaseIdentifier",
  description: "asks to keep the voice down",

  type: "custom",
  match: (message) =>
    /[a-zA-Z]+/g.test(message.content) &&
    message.content.toUpperCase() == message.content,

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    if (!message.inGuild() || message.author.bot) return;

    if (getRandomNumber() > 60)
      await message.reply("Keep your voice down! >_>");
  },
};
