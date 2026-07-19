import HighlightGuild from "../../../models/highlightGuild.js";
import Highlight from "../../../models/highlight.js";

import masks from "../../../utils/core/mask.js";

import highlightGuildCache from "../../../cache/highlight-guild.js";
import highlightCache from "../../../cache/highlight.js";

import getHighlightEmbed from "../../../utils/components/getHighlightEmbed.js";
import getHighlightMessageButton from "../../../utils/components/getHighlightMessageButton.js";

const DEFAULT_QUANTITY = 4;

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

  let highlightGuild = await highlightGuildCache.get(reaction.message.guildId);

  if(highlightGuild) {
    if (highlightGuild.found) {
      highlightGuild = highlightGuild.value;
    } else {
      highlightGuild = null;
    }
  }
  else {
    highlightGuild = await HighlightGuild.findOne({
      guildId: reaction.message.guildId,
    });

    await highlightGuildCache.set(reaction.message.guildId, highlightGuild);
  }

  if (!highlightGuild || !highlightGuild.active) return;

  if (reaction.count < (highlightGuild.count || DEFAULT_QUANTITY)) return;

  const guildId = reaction.message.guildId;
  const channelId = reaction.message.channelId;
  const messageId = reaction.message.id;

  const cacheIdentifier = `${guildId}$${channelId}$${messageId}`;

  let highlight = await highlightCache.get(cacheIdentifier);

  if (!highlight) {
    highlight = await Highlight.findOne({
      guildId,
      channelId,
      messageId,
    });
  } else {
    highlight = Highlight.hydrate(highlight.value);
  }

  if (highlight) {
    if (highlight.count <= reaction.count) return;

    const channel = await client.channels.cache.get(
      highlight.highlightChannelId,
    );

    if (!channel) return;

    highlight.count = reaction.count;

    await highlight.save();
    await highlightCache.set(cacheIdentifier, highlight);

    const message = await channel.messages.fetch(
      highlight.highlightMessageId.toString(),
    );

    await message.edit({
      content: `⭐ ${highlight.count} - ${masks.channel(highlight.channelId)}`,
      embeds: [
        await getHighlightEmbed(
          channel.guild,
          highlight,
          reaction.message.author,
        ),
      ],
      components: [await getHighlightMessageButton(highlight)],
    });
    return;
  }

  const channel = await client.channels.cache.get(highlightGuild.channelId);

  if (!channel) return;

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

  if (channel && channel.isTextBased()) {
    let newHighlight = new Highlight({
      guildId: reaction.message.guildId,
      userId: reaction.message.author.id,
      messageId: reaction.message.id,
      channelId: reaction.message.channelId,
      emojiId: reaction.emoji.id,
      message: reaction.message.content,
      attachment,
      fileName,
      count: reaction.count,
      creationDate: reaction.message.createdAt,
    });

    const message = await channel.send({
      content: `⭐ ${newHighlight.count} - ${masks.channel(newHighlight.channelId)}`,
      embeds: [
        await getHighlightEmbed(
          channel.guild,
          newHighlight,
          reaction.message.author,
        ),
      ],
      components: [await getHighlightMessageButton(newHighlight)],
    });

    newHighlight.highlightMessageId = message.id;
    newHighlight.highlightChannelId = channel.id;

    await newHighlight.save();
    await highlightCache.set(cacheIdentifier, newHighlight);
  }
};
