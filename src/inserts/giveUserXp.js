import { Client, Message } from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";
import xp from "../utils/xp.js";
import cache from "../utils/cache/xp.js";
import origins from "../enums/xp/origins.js";

const MESSAGE_COOLDOWN = 6000;

export default {
  name: "giveUserXP",
  description: "calculates the user leveling",

  type: "custom",
  match: (message) =>
    !message.author.bot &&
    message.inGuild() &&
    !cache.searched(
      `${message.guild.id}_${message.author.id}_${origins.COMMENT}`,
    ),

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    const xpToGive = getRandom(5, 10);

    await xp.give(message.author, message.guild, message.channel, xpToGive, {
      after: (level) => {
        const CACHE_REF = `${message.guild.id}_${message.author.id}_${origins.COMMENT}`;

        cache.set(CACHE_REF, xpToGive);
        setTimeout(() => {
          cache.resetOne(CACHE_REF);
        }, MESSAGE_COOLDOWN);
      },
    });
  },
};
