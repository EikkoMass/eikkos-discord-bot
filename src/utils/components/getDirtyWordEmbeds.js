import { Client } from "discord.js";
import { EmbedBuilder } from "discord.js";

import DirtyWord from "../../models/dirtyword.js";
import Enum from "../../enums/dirtyWord/types.js";
import { getLocalization } from "../i18n.js";

/**
 *  @param {Client} client
 *  @param {DirtyWord[]} dWords
 *
 */
async function getDirtyWordEmbeds(client, interaction, dWords) {
  const words = await getLocalization(interaction.locale, `dirty-word`);
  const embeds = [];

  for (const w of dWords) {
    const type =
      w.type === Enum.CONTAINS ? words.ContainsWord : words.ExactWord;

    const embed = new EmbedBuilder()
      .setDescription(`${type} \`${w.word}\``)
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
