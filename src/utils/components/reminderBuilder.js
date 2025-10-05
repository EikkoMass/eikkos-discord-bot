import { EmbedBuilder } from "discord.js";
import Reminder from "../../models/reminder.js";
import cache from "../cache/reminder.js";
import { formatMessage, getLocalization } from "../i18n.js";

export default async (guild, reminder) => {
  const embed = new EmbedBuilder();

  if (!guild) return;

  const channel = guild.channels.cache.get(reminder.channelId);

  if (!channel) return;

  const member = await guild.members.cache.get(reminder.userId);

  const dynDuration =
    reminder.duration - (Date.now() - reminder.creationDate.getTime());

  const identifier = `${reminder.userId}$${reminder.guildId}`;
  const words = await getLocalization(reminder.locale, `remind`);

  embed.setDescription(reminder.message || " ").setFooter({
    iconURL: member.displayAvatarURL({ size: 256 }),
    text: formatMessage(words.EventHistory, [
      member.displayName || member.nickname,
      dynDuration,
    ]),
  });

  if (dynDuration <= 0) {
    channel.send({
      content: `<@${reminder.receiverId || reminder.userId}>`,
      embeds: [embed],
    });
    const res = await Reminder.findByIdAndDelete({ _id: reminder._id }).catch(
      () => {},
    );
    return;
  }

  (function () {
    const timeout = setTimeout(async () => {
      channel.send({
        content: `<@${reminder.receiverId || reminder.userId}>`,
        embeds: [embed],
      });

      const res = await Reminder.findByIdAndDelete({ _id: reminder._id }).catch(
        () => {},
      );
      cache.remove(identifier, reminder._id);
    }, dynDuration);

    if (!Array.isArray(cache.get(identifier))) cache.allocate(identifier);

    cache.add(identifier, {
      timeout,
      reminder,
    });
  })();
};
