import cache from "../../cache/user.js";
import discord from "../../configs/discord.json" with { type: "json" };

export async function getUser(client, userId) {
  const CACHE_REF = `${userId}`;

  let user = await cache.get(CACHE_REF);

  if (!user) {
    try {
      const dUser = await client.users.cache.get(userId, {
        force: true,
        cache: true,
      });
      if (dUser) {
        user = {
          avatarUrl: dUser.displayAvatarURL({
            size: discord.avatar.size.medium,
          }),
        };
      }

      await cache.set(CACHE_REF, user);
    } catch (e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  } else {
    user = user.value;
  }

  return user;
}

export default getUser;
