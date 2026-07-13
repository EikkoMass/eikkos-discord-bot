import { Client, Message } from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";
import xp from "../utils/xp.js";
import cache from "../utils/cache/xp.js";
import origins from "../enums/xp/origins.js";

const COOLDOWN_IN_SECONDS = 12;

const getCacheRef = (message) =>
  `${message.guild.id}_${message.author.id}_${origins.COMMENT}`;

export default {
  name: "giveUserXP",
  description: "calculates the user leveling",

  type: "custom",
  match: async (message) =>
    !message.author.bot &&
    message.inGuild() &&
    !(await cache.exists(getCacheRef(message))),

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    const xpToGive = getRandom(5, 10);

    await xp.give(message.author, message.guild, message.channel, xpToGive, {
      after: async (level) => {
        await cache.set(getCacheRef(message), xpToGive, COOLDOWN_IN_SECONDS);
      },
    });
  },
};
