import { Client, Message } from "discord.js";
import DirtyWord from "../models/dirtyword.js";
import cache from "../utils/cache/dirty-word.js";

import Enum from "../enums/dirtyWord/types.js";

export default {
  name: "dirtyWord",
  description: "Detects messages containing dirty words",

  type: "custom",
  match: (message) => message.inGuild() && !message.author.bot,

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    try {
      const CACHE_REF = `${message.guild.id}`;
      let dirtyWords = cache.get(CACHE_REF);

      if (!dirtyWords && !cache.searched(CACHE_REF)) {
        dirtyWords = await DirtyWord.find({ guildId: message.guild.id });

        cache.set(CACHE_REF, dirtyWords);
      }

      if (!dirtyWords) return;

      const currentMessage = message.content?.toLowerCase();

      for (const dWord of dirtyWords) {
        const word = dWord.word.toLowerCase();

        if (
          (dWord.type === Enum.CONTAINS && currentMessage.includes(word)) ||
          currentMessage === word
        ) {
          const targetUser = await message.guild.members.fetch(
            message.author.id,
          );

          targetUser.kick("Bad word identified >:( ").catch(() => {});
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
};
