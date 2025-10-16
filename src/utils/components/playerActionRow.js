import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";

/**
 * @returns {ActionRowBuilder} actionRow
 */
export default () => {
  const row = new ActionRowBuilder();
  const hash = crypto.randomUUID();

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: `player;pause;`,
          hash,
        }),
      )
      .setEmoji("<:pause:1391131987195985941>")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: `player;play;`,
          hash,
        }),
      )
      .setEmoji("<:play:1391132094230429736>")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: `player;skip;`,
          hash,
        }),
      )
      .setEmoji("<:skip_right:1391132023745286296>")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: `player;shuffle;`,
          hash,
        }),
      )
      .setEmoji("<:shuffle:1394480011573985391>")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: `player;stop;`,
          hash,
        }),
      )
      .setEmoji("<:stop:1391132125281124362>")
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  return row;
};
