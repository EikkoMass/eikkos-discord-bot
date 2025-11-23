import { EmbedBuilder } from "discord.js";
import { getUser } from "../importers/getUser.js";

async function getNoteEmbeds(client, notes) {
  const embeds = [];

  for (let note of notes) {
    const owner = (await getUser(client, note.userId)) || client.user;

    let embed = new EmbedBuilder()
      .setDescription(note.text)
      .setColor("Random")
      .setTimestamp(note.creationDate)
      .setFooter({
        text: note._id.toString(),
        iconURL: owner.displayAvatarURL({ size: 256 }),
      });

    if (note.title) embed.setTitle(note.title);
    if (note.img) embed.setThumbnail(note.img);

    embeds.push(embed);
  }

  return embeds;
}

export default getNoteEmbeds;
