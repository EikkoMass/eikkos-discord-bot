import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import emojis from "../../utils/core/emojis.js";

function getPaginatorActionRows(customIdObj, count, page, amount = 10) {
  const minPage = 1;
  const maxPage = Math.ceil(count / amount);
  const lastPage = Math.max(minPage, page - 1);
  const nextPage = Math.min(maxPage, page + 1);

  const row = new ActionRowBuilder();

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          ...customIdObj,
          page: lastPage,
          hash: crypto.randomUUID(),
        }),
      )
      .setDisabled(page === minPage)
      .setEmoji(emojis.get("before"))
      .setLabel(` `)
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          ...customIdObj,
          page: page,
          hash: crypto.randomUUID(),
        }),
      )
      .setDisabled(true)
      .setLabel(`${page}`)
      .setStyle(ButtonStyle.Primary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          ...customIdObj,
          page: nextPage,
          hash: crypto.randomUUID(),
        }),
      )
      .setDisabled(page === maxPage)
      .setEmoji(emojis.get("next"))
      .setLabel(` `)
      .setStyle(ButtonStyle.Secondary),
  );

  return row;
}

export default getPaginatorActionRows;
