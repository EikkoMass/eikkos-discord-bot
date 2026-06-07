import cache from "../cache/user.js";
import discord from "../../configs/discord.json" with { type: "json" };

export async function getUser(client, userId) {
  let user = await cache.get(`user:${userId}`);

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

      await cache.set(`user:${userId}`, user);
    } catch (e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  } else {
    user = user.value;
  }

  return user;
}

export default getUser;
