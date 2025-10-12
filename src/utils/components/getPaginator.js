import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

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
      .setEmoji("<:before:1405034897004957761>")
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
      .setEmoji("<:next:1405034907264094259>")
      .setLabel(` `)
      .setStyle(ButtonStyle.Secondary),
  );

  return row;
}

export default getPaginatorActionRows;
