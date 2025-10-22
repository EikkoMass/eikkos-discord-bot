import HighlightGuild from "../../models/highlightGuild.js";
import Highlight from "../../models/highlight.js";

import getHighlightEmbed from "../../utils/components/getHighlightEmbed.js";
import getHighlightMessageButton from "../../utils/components/getHighlightMessageButton.js";

export default async (client, reaction, user) => {
  if (reaction.partial) {
    try {
      await reaction.fetch();
    } catch (error) {
      console.error("Something went wrong when fetching the reaction:", error);
      return;
    }
  }

  if (reaction.me) return;
  if (reaction._emoji.name !== "⭐") return;

  let highlightGuild = await HighlightGuild.findOne({
    guildId: reaction.message.guildId,
  });

  if (!highlightGuild || !highlightGuild.active) return;

  if (reaction.count < (highlightGuild.count || 4)) return;

  let highlight = await Highlight.findOne({
    guildId: reaction.message.guildId,
    channelId: reaction.message.channelId,
    messageId: reaction.message.id,
  });

  let messageUser = await client.users.fetch(reaction.message.author.id, {
    force: true,
    cache: true,
  });

  const channel = await client.channels.cache.get(highlightGuild.channelId);

  if (highlight) {
    if (highlight.count <= reaction.count) return;

    highlight.count = reaction.count;
    await highlight.save();

    const message = await channel.messages.fetch(highlight.messageId);

    await message.edit({
      content: `⭐ ${highlight.count} - ${channel.requester.toString()}`,
      embeds: [await getHighlightEmbed(highlight, messageUser)],
      components: [await getHighlightMessageButton(highlight)],
    });
    return;
  }

  let message = reaction.message.content;
  let attachment;
  let fileName;

  if (reaction.message?.attachments?.size > 0) {
    let images = reaction.message.attachments
      .values()
      ?.toArray()
      .filter((attachment) => attachment.contentType.startsWith("image"));

    if (images.length > 0) {
      fileName = images[0].name;
      attachment = images[0].url;
    }
  }

  let newHighlight = await Highlight.insertOne({
    guildId: reaction.message.guildId,
    userId: reaction.message.author.id,
    messageId: reaction.message.id,
    channelId: reaction.message.channelId,
    emojiId: reaction.emoji.id,
    message,
    attachment,
    fileName,
    count: reaction.count,
    creationDate: new Date(),
  });

  if (channel && channel.isTextBased()) {
    channel.send({
      content: `⭐ ${newHighlight.count} - <#${newHighlight.channelId}>`,
      embeds: [await getHighlightEmbed(newHighlight, messageUser)],
      components: [await getHighlightMessageButton(newHighlight)],
    });
  }
};
