import { ActivityType } from "discord.js";
import Reminder from "../../models/reminder.js";
import build from "../../utils/components/reminderBuilder.js";

export default async (client) => {
  const guilds = client.guilds.cache.values();

  if (!guilds) return;

  for (const guild of guilds) {
    let reminders = await Reminder.find({ guildId: guild.id });

    if (!reminders) return;

    for (const reminder of reminders) {
      build(guild, reminder);
    }
  }
};
