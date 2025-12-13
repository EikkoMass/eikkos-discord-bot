import cache from "../cache/user.js";

export async function getUser(client, userId) {
  let user = cache.get(userId);

  if (!user && !cache.searched(userId)) {
    try {
      user = await client.users.cache.get(userId, { force: true, cache: true });
      if (user) cache.set(userId, user);
    } catch (e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  }

  return user;
}

export default getUser;
