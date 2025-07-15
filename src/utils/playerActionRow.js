const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

/**
 * @returns {ActionRowBuilder} actionRow
 */
module.exports = () => {
  const row = new ActionRowBuilder();

  row.components.push(
    new ButtonBuilder()
      .setCustomId(`player;pause;`)
      .setEmoji("<:pause:1391131987195985941>")
      .setLabel(' ')
      .setStyle(ButtonStyle.Secondary)
  )

  row.components.push(
    new ButtonBuilder()
      .setCustomId(`player;play;`)
      .setEmoji("<:play:1391132094230429736>")
      .setLabel(' ')
      .setStyle(ButtonStyle.Secondary)
  )

  row.components.push(
    new ButtonBuilder()
      .setCustomId(`player;skip;`)
      .setEmoji("<:skip_right:1391132023745286296>")
      .setLabel(' ')
      .setStyle(ButtonStyle.Secondary)
  )

  row.components.push(
  new ButtonBuilder()
    .setCustomId(`player;shuffle;`)
    .setEmoji("<:shuffle:1394480011573985391>")
    .setLabel(' ')
    .setStyle(ButtonStyle.Secondary)
  )

  row.components.push(
    new ButtonBuilder()
      .setCustomId(`player;stop;`)
      .setEmoji("<:stop:1391132125281124362>")
      .setLabel(' ')
      .setStyle(ButtonStyle.Secondary)
  )

  return row;
}