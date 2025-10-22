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
      text: highlight.creationDate.toString(),
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

export default getHighlightEmbed;
