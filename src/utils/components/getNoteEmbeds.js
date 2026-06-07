import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";

import discord from "../../configs/discord.json" with { type: "json" };

async function getNoteEmbeds(client, notes) {
  const embeds = [];

  let clientUser = {
    avatarUrl: client.user.displayAvatarURL({
      size: discord.avatar.size.medium,
    }),
  };

  for (let note of notes) {
    const cacheUser = await getUser(client, note.userId);
    let owner = cacheUser || clientUser;

    let embed = new EmbedBuilder()
      .setDescription(note.text)
      .setColor("Random")
      .setTimestamp(note.creationDate)
      .setFooter({
        text: note._id.toString(),
        iconURL: owner.avatarUrl,
      });

    if (note.title) embed.setTitle(note.title);
    if (note.img) embed.setThumbnail(note.img);

    embeds.push(embed);
  }

  return embeds;
}

export default getNoteEmbeds;
