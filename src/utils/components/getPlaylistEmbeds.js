import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";

import discord from "../../configs/discord.json" with { type: "json" };

async function getPlaylistEmbeds(client, playlists) {
  const embeds = [];

  for (let playlist of playlists) {
    const owner = (await getUser(client, playlist.userId)) || client.user;

    let embed = new EmbedBuilder()
      .setTitle(playlist.name)
      .setDescription(playlist.link)
      .setColor("Random")
      .setTimestamp(playlist.creationDate)
      .setFooter({
        text: playlist._id.toString(),
        iconURL: owner.displayAvatarURL({ size: discord.avatar.size.medium }),
      });

    embeds.push(embed);
  }

  return embeds;
}

export default getPlaylistEmbeds;
