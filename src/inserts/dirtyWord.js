import { Client, Message } from "discord.js";
import DirtyWord from "../models/dirtyword.js";
import cache from "../utils/cache/dirty-word.js";

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
      let dirtyWordObj = cache.result.find(message.guild.id);
      let alreadySearchedOnDB = cache.search.exists(message.guild.id);

      if (!dirtyWordObj && !alreadySearchedOnDB) {
        dirtyWordObj = await DirtyWord.findOne({ guildId: message.guild.id });
        client.dirtyWordCache.search.push(`${message.guild.id}`);

        if (!dirtyWordObj) return;

        cache.result.add(dirtyWordObj);
      } else if (!dirtyWordObj) return;

      const currentMessage = message.content?.toLowerCase();
      const word = dirtyWordObj.word.toLowerCase();

      if (
        (dirtyWordObj.type === 1 && currentMessage.includes(word)) ||
        currentMessage === word
      ) {
        const targetUser = await message.guild.members.fetch(message.author.id);
        targetUser.kick("Bad word identified >:( ").catch(() => {});
      }
    } catch (e) {
      console.log(e);
    }
  },
};
