export default {
  authenticate,
  getToken,
};

let tokenObj = {};

export function getToken() {
  return tokenObj;
}

export async function authenticate() {
  const grantType = "client_credentials";
  const igdb = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT_ID}&client_secret=${process.env.IGDB_CLIENT_SECRET}&grant_type=${grantType}`,
    {
      method: "POST",
    },
  );

  const json = await igdb.json();

  tokenObj = json;
  setTimeout(authenticate, 604800 * 1000); // 7 days
}
