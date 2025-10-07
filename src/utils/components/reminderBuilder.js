import { EmbedBuilder, Guild } from "discord.js";
import Reminder from "../../models/reminder.js";
import cache from "../cache/reminder.js";
import { formatMessage, getLocalization } from "../i18n.js";
import prettyMs from "pretty-ms";

/**
 *  @param {Guild} guild
 *  @param {Reminder} reminder
 */
export default async (guild, reminder) => {
  const embed = new EmbedBuilder();

  if (!guild) {
    const res = await Reminder.deleteMany({
      guildId: reminder.guildId,
      channelId: reminder.channelId,
    });
    return;
  }

  const channel =
    guild.channels.cache.get(reminder.channelId) ||
    (await guild.channels.fetch(reminder.channelId));

  if (!channel) {
    const res = await Reminder.deleteMany({
      guildId: channel.guild.id,
      channelId: reminder.channelId,
    });
    return;
  }

  const member = guild.members.cache.get(reminder.userId);

  const dynDuration =
    reminder.duration - (Date.now() - reminder.creationDate.getTime());

  const identifier = `${reminder.userId}$${reminder.guildId}`;
  const words = await getLocalization(reminder.locale, `remind`);

  embed.setDescription(reminder.message || " ").setFooter({
    iconURL: member.displayAvatarURL({ size: 256 }),
    text: formatMessage(words.EventHistory, [
      member.displayName || member.nickname,
      prettyMs(dynDuration < 0 ? dynDuration * -1 : dynDuration, {
        verbose: true,
      }),
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
