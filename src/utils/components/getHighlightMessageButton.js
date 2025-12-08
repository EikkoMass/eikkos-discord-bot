import { ButtonStyle, ButtonBuilder, ActionRowBuilder } from "discord.js";

/**
 *  @param  {Highlight} highlight
 */
async function getHighlightMessageButton(highlight) {
  const row = new ActionRowBuilder();

  row.addComponents(
    new ButtonBuilder()
      .setURL(
        `https://discord.com/channels/${highlight.guildId}/${highlight.channelId}/${highlight.messageId}`,
      )
      .setLabel("Go to the message")
      .setStyle(ButtonStyle.Link),
  );

  return row;
}

export default getHighlightMessageButton;
