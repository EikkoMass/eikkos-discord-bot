import {
  Client,
  Message,
  AttachmentBuilder,
  MessageFlags,
  EmbedBuilder,
} from "discord.js";
import { getRandom } from "../utils/core/randomizer.js";
import xp from "../utils/xp.js";
import { getLocalization } from "../utils/i18n.js";

const MIN_SIZE = 3;

// %
const maxPerc = 100;
const probPerc = 1;
const probPercFire = 20;
const probPercBonus = 3;

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

    if (message.content?.length > MIN_SIZE && getRandom() > (maxPerc - probPerc)) {
      const isFire = getRandom() > (maxPerc - probPercFire);

      const file = new AttachmentBuilder(
        `gifs/${isFire ? "fire" : "nerd"}.gif`,
      );
      await message.reply({
        content: isFire
          ? `"${message.content.toUpperCase()}" 🗣️🗣️🗣️🔥🔥🔥`
          : `'${message.content.toLowerCase()}' ☝☝🤓`,
        files: [file],
      });

      if (!isFire && getRandom() > (maxPerc - probPercBonus)) {
        const words = await getLocalization(
          message.guild.preferredLocale,
          "nerd-detector",
        );
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
              .setDescription(words.FeelsBad),
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
