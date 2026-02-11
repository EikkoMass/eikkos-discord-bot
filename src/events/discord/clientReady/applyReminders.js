import { Client } from "discord.js";
import Reminder from "../../../models/reminder.js";
import build from "../../../utils/components/reminderBuilder.js";

/**
 *  @param {Client} client
 */
export default async (client) => {
  const guilds = client.guilds.cache.values()?.toArray();

  if (!guilds || !guilds.length) return;

  for (const guild of guilds) {
    let reminders = await Reminder.find({ guildId: guild.id });

    if (!reminders || !reminders.length) continue;
    for (const reminder of reminders) {
      build(guild, reminder);
    }
  }
};
