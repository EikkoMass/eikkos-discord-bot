import {
  Client,
  Message,
  AttachmentBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import { getRandomNumber } from "../utils/core/randomizer.js";
import xp from "../utils/xp.js";

export default {
  name: "nerdDetector",
  description: "quote the user with the nerdiest comment possible",
  match: "",
  type: "includes",

  /**
   *  @param {Client} client
   *  @param {Message} message
   */
  callback: async (client, message) => {
    if (message.author.bot) return;

    // 3%
    if (message.content?.length > 3 && getRandomNumber() > 97) {
      // 15%
      const isFire = getRandomNumber() > 85;

      const file = new AttachmentBuilder(
        `src/gifs/${isFire ? "fire" : "nerd"}.gif`,
      );
      await message.reply({
        content: isFire
          ? `"${message.content.toUpperCase()}" 🗣️🗣️🗣️🔥🔥🔥`
          : `'${message.content.toLowerCase()}' ☝☝🤓`,
        files: [file],
      });

      // 1%
      if (!isFire && getRandomNumber() > 99) {
        const experience = xp.getRandomXp(25, 35);

        await message.reply({
          flags: [MessageFlags.Ephemeral],
          embeds: [
            new EmbedBuilder()
              .setFields([
                {
                  name: "XP",
                  value: `${experience}`,
                },
              ])
              .setDescription("Ok, i feel bad about that. Take some extra xp"),
          ],
        });

        await xp.give(
          message.author,
          message.guild,
          message.channel,
          experience,
        );
      }
    }
  },
};
