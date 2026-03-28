import {
  Client,
  Message,
  AttachmentBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";
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

    // 1%
    if (message.content?.length > 3 && getRandom() > 99) {
      // 20%
      const isFire = getRandom() > 80;

      const file = new AttachmentBuilder(
        `src/gifs/${isFire ? "fire" : "nerd"}.gif`,
      );
      await message.reply({
        content: isFire
          ? `"${message.content.toUpperCase()}" 🗣️🗣️🗣️🔥🔥🔥`
          : `'${message.content.toLowerCase()}' ☝☝🤓`,
        files: [file],
      });

      // 3%
      if (!isFire && getRandom() > 97) {
        const experience = getRandom(25, 35);

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
