import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";

import discord from "../../configs/discord.json" with { type: "json" };

async function getNotifyEmbeds(client, notify) {
  const embeds = [];

  for (const n of notify) {
    const user = (await getUser(client, n.userId)) || client.user;

    const embed = new EmbedBuilder()
      .setTitle(n.title ?? `Notification`)
      .setTimestamp(n.creationDate)
      .setColor("Random")
      .setFooter({
        text: n._id.toString(),
        iconURL: user.displayAvatarURL({ size: discord.avatar.size.medium }),
      });

    if (n.message) {
      embed.setDescription(n.message);
    }

    embeds.push(embed);
  }

  return embeds;
}

export default getNotifyEmbeds;
