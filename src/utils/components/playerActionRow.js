import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from "discord.js";
import emojis from "../../utils/core/emojis.js";
import actions from "../../configs/actions.json" with { type: "json" };

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
          id: actions.player.pause,
          hash,
        }),
      )
      .setEmoji(emojis.get("pause"))
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: actions.player.play,
          hash,
        }),
      )
      .setEmoji(emojis.get("play"))
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: actions.player.skip,
          hash,
        }),
      )
      .setEmoji(emojis.get("skip"))
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: actions.player.shuffle,
          hash,
        }),
      )
      .setEmoji(emojis.get("shuffle"))
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  row.components.push(
    new ButtonBuilder()
      .setCustomId(
        JSON.stringify({
          id: actions.player.stop,
          hash,
        }),
      )
      .setEmoji(emojis.get("stop"))
      .setLabel(" ")
      .setStyle(ButtonStyle.Secondary),
  );

  return row;
};
