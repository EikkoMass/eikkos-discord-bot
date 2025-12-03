import { EmbedBuilder } from "@discordjs/builders";
import Level from "../models/level.js";

export function calc(level) {
  return 100 * level || 1;
}

export function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function give(user, guild, channel, amount, callbacks = {}) {
  const query = {
    userId: user.id,
    guildId: guild.id,
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += amount;

      if (level.xp > calc(level.level)) {
        level.xp = 0;
        level.level += 1;

        channel.send({
          embeds: [
            new EmbedBuilder().setDescription(
              `<@${user.id}> you have leveled up to **level ${level.level}**`,
            ),
          ],
        });
      }

      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
      });

      callbacks?.after?.(level);
    }
    // if (!level)
    else {
      //create new level

      const newLevel = new Level({
        userId: user.id,
        guildId: guild.id,
        xp: amount,
      });

      await newLevel.save();

      callbacks?.after?.(newLevel);
    }
  } catch (e) {
    console.log(`Error giving XP: ${e}`);
  }
}

export default {
  calc,
  getRandomXp,
  give,
};
