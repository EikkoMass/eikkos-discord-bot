import { Client, Message } from "discord.js";
import DirtyWord from "../models/dirtyword.js";

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
      let dirtyWordObj = client.dirtyWordCache.result.find(
        (dirty) => dirty.guildId === message.guild.id,
      );
      let alreadySearchedOnDB = client.dirtyWordCache.search.some(
        (dirty) => dirty === message.guild.id,
      );

      if (!dirtyWordObj && !alreadySearchedOnDB) {
        dirtyWordObj = await DirtyWord.findOne({ guildId: message.guild.id });
        client.dirtyWordCache.search.push(`${message.guild.id}`);

        if (!dirtyWordObj) return;

        client.dirtyWordCache.result.push(dirtyWordObj);
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
