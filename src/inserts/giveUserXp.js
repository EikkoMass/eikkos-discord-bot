import { Client, Message } from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";
import xp from "../utils/xp.js";
const cooldowns = new Set();

const MESSAGE_COOLDOWN = 6000;

export default {
  name: "giveUserXP",
  description: "calculates the user leveling",

  type: "custom",
  match: (message) =>
    !message.author.bot &&
    message.inGuild() &&
    !cooldowns.has(message.author.id),

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    const xpToGive = getRandom(5, 15);

    await xp.give(message.author, message.guild, message.channel, xpToGive, {
      after: (level) => {
        cooldowns.add(message.author.id);
        setTimeout(() => {
          cooldowns.delete(message.author.id);
        }, MESSAGE_COOLDOWN);
      },
    });
  },
};
