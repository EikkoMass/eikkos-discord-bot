let userCache = {};

export async function getUser(client, userId) {
  let user = userCache[userId];

  if (!user) {
    try {

      user = await client.users.cache.get(userId, { force: true, cache: true });
      if(user) userCache[userId] = user;

    } catch (e) {
      console.log(`usuario nao encontrado: ${e}`);
    }
  }

  return userCache[userId];
}

export function resetUserCache()
{
  userCache = {};
}

export default getUser;