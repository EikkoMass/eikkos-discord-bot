import valkey from "../utils/authenticators/valkey.js";

const TTL = 7200;
const PREFIX = `igdb:`;

export async function get(id) {
  let result = await valkey.actions.get(`${PREFIX}${id}`);
  return result ? JSON.parse(result) : null;
}

export async function set(key, value, expiration) {
  let found = !!value;

  await valkey.actions.set(
    `${PREFIX}${key}`,
    JSON.stringify({
      found,
      value,
    }),
    {
      count: expiration ?? TTL,
    },
  );
}

export default {
  get,
  set
};
