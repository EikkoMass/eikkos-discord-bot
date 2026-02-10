import { EmbedBuilder } from "@discordjs/builders";
import Level from "../models/level.js";
import cache from "./cache/level.js";

export function calc(level) {
  return 100 * level || 1;
}

export function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function give(
  user,
  guild,
  channel,
  amount,
  callbacks = {},
  silent = false,
) {
  const userId = Number.isNaN(user) ? user.id : user;
  const guildId = Number.isNaN(guild) ? guild.id : guild;

  const CACHE_REF = `${guildId}${userId}`;

  try {
    let level = cache.get(CACHE_REF);

    if (!level) {
      level = await Level.findOne({
        userId: userId,
        guildId: guildId,
      });

      if (!level) {
        level = new Level({
          userId: userId,
          guildId: guildId,
          xp: amount,
          level: 1,
        });

        let levelCalc = calc(level.level);

        while (level.xp > levelCalc) {
          level.level += 1;
          levelCalc = calc(level.level);
        }

        await level.save();
        cache.set(CACHE_REF, level);
        callbacks?.after?.(level);
        return;
      }
    }

    level.xp += amount;

    let levelCalc = calc(level.level);
    let levelUp = false;

    while (level.xp > levelCalc) {
      levelUp = true;
      level.level += 1;
      levelCalc = calc(level.level);
    }

    if (levelUp && !silent) {
      channel.send({
        embeds: [
          new EmbedBuilder().setDescription(
            `<@${userId}> you have leveled up to **level ${level.level}**`,
          ),
        ],
      });
    }

    await level.save().catch((e) => {
      console.log(`Error saving updated level ${e}`);
    });

    cache.set(CACHE_REF, level);
    callbacks?.after?.(level);
  } catch (e) {
    console.log(`Error giving XP: ${e}`);
  }
}

export default {
  calc,
  getRandomXp,
  give,
};
