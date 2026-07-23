import cache from "../../cache/igdb.js";

export default {
  getToken
};

const CACHE_IGDB_KEY = "token";

export async function getToken() {

  const tokenObj = await cache.get(CACHE_IGDB_KEY);
  if (!tokenObj || !tokenObj.found) {
    const token = await authenticate();
    await cache.set(CACHE_IGDB_KEY, token, token.expires_in);
    return token;
  }
  console.log("log");
  return tokenObj.value;
}

export async function authenticate() {
  const grantType = "client_credentials";
  const igdb = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=${grantType}`,
    {
      method: "POST",
    },
  );

  return await igdb.json();
}
