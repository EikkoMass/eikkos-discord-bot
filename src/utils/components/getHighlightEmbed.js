import Highlight from "../../models/highlight.js";
import { User, EmbedBuilder, Colors } from "discord.js";

/**
 *  @param  {Highlight} highlight
 *  @param {User} user
 */
async function getHighlightEmbed(highlight, user) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${user.username} (${user.id})`,
      iconURL: user.avatarURL({ size: 1024 }),
    })
    .setDescription(highlight.message || " ")
    .setFooter({
      text: getFormattedDate(highlight),
    })
    .setColor(Colors.White);

  if (highlight.attachment) {
    embed.setFields([
      {
        name: "📁 File",
        value: `[${highlight.fileName}](${highlight.attachment})`,
      },
    ]);
    embed.setImage(highlight.attachment);
  }

  return embed;
}

function getFormattedDate(highlight) {
  let date = highlight.creationDate;
  let today = new Date();

  let formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  let time = `${date.getHours()}:${date.getMinutes()}`;

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    formattedDate = "Today";
  }

  date.setDate(date.getDate() + 1);
  if (date.getTime() === today.getTime()) {
    formattedDate = "Yesterday";
  }

  return `${formattedDate}, ${time}`;
}

export default getHighlightEmbed;
