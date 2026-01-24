import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import emojis from "../../utils/core/emojis.js";
import discord from "../../configs/discord.json" with { type: "json" };

function getPaginatorActionRows(
  customIdObj,
  count,
  page,
  amount = discord.embeds.max,
) {
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
          page: minPage,
          hash: crypto.randomUUID(),
        }),
      )
      .setDisabled(page === minPage)
      .setEmoji(emojis.get("first"))
      .setLabel(` `)
      .setStyle(ButtonStyle.Secondary),
  );

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

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          ...customIdObj,
          page: maxPage,
          hash: crypto.randomUUID(),
        }),
      )
      .setDisabled(page === maxPage)
      .setEmoji(emojis.get("last"))
      .setLabel(` `)
      .setStyle(ButtonStyle.Secondary),
  );

  return row;
}

export default getPaginatorActionRows;
