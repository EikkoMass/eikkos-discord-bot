import { EmbedBuilder } from "discord.js";

let userCache = [];

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

  userCache = [];
  return embeds;
}

async function getUser(client, userId) {
  let user = userCache.find((user) => user.id == userId);

  if (!user) {
    try {
      user = await client.users.cache.get(userId, { force: true, cache: true });
      userCache[userId] = user;
    } catch (e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  }

  return userCache[userId];
}

export default getNoteEmbeds;
