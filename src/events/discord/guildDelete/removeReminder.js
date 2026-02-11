import { Client, Guild } from "discord.js";
import Reminder from "../../../models/reminder.js";

/**
 *  @param {Client} client
 *  @param {Guild} guild
 */
export default async (client, guild) => {
  try {
    const res = await Reminder.deleteMany({
      guildId: guild.id,
    });
  } catch (e) {
    console.log(`Error trying to delete reminder by guild: ${e}`);
  }
};
