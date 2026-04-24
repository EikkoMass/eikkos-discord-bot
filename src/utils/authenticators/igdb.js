export default {
  authenticate,
  getToken,
};

const MAX_SAFE_INTEGER = 2147483647;

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

  const expiration = tokenObj.expires_in * 1000;
  setTimeout(
    authenticate,
    expiration > MAX_SAFE_INTEGER ? MAX_SAFE_INTEGER : expiration,
  );
}
