import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";

import discord from "../../configs/discord.json" with { type: "json" };

async function getPlaylistEmbeds(client, playlists) {
  const embeds = [];

  let clientUser = {
    avatarUrl: client.user.displayAvatarURL({
      size: discord.avatar.size.medium,
    }),
  };

  for (let playlist of playlists) {
    const cacheUser = await getUser(client, playlist.userId);
    const owner = cacheUser || clientUser;

    let embed = new EmbedBuilder()
      .setTitle(playlist.name)
      .setDescription(playlist.link)
      .setColor("Random")
      .setTimestamp(playlist.creationDate)
      .setFooter({
        text: playlist._id.toString(),
        iconURL: owner.avatarUrl,
      });

    embeds.push(embed);
  }

  return embeds;
}

export default getPlaylistEmbeds;
