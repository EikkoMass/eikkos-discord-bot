import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";
import cache from "../cache/user.js";

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
        iconURL: owner.displayAvatarURL({ size: 256 }),
      });

    embeds.push(embed);
  }

  cache.reset();
  return embeds;
}

export default getPlaylistEmbeds;
