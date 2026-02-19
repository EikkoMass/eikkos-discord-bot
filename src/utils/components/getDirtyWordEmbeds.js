import { Client } from "discord.js";
import { EmbedBuilder } from "discord.js";

import DirtyWord from "../../models/dirtyword.js";

/**
 *  @param {Client} client
 *  @param {DirtyWord[]} dWords
 *
 */
async function getDirtyWordEmbeds(client, dWords) {
  const embeds = [];

  for (const w of dWords) {
    const embed = new EmbedBuilder()
      .setDescription(w.word)
      .setTimestamp(w.creationDate ?? Date.now())
      .setColor("Random")
      .setFooter({
        text: w._id.toString(),
      });

    embeds.push(embed);
  }

  return embeds;
}

export default getDirtyWordEmbeds;
