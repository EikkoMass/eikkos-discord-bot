import { Client, GuildChannel } from "discord.js";
import Reminder from "../../../models/reminder.js";

/**
 *  @param {Client} client
 *  @param {GuildChannel} channel
 */
export default async (client, channel) => {
  try {
    const res = await Reminder.deleteMany({
      guildId: channel.guild.id,
      channelId: channel.id,
    });
  } catch (e) {
    console.log(`Error trying to delete reminder by channel: ${e}`);
  }
};
