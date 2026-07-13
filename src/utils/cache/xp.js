import valkey from "../authenticators/valkey.js";

const DEFAULT_TTL = 6;
const PREFIX = `xp:`;

async function get(key) {
  let result = await valkey.actions.get(`${PREFIX}${key}`);
  return result ? JSON.parse(result) : null;
}

async function set(key, value, ttl) {
  let found = !!value;

  await valkey.actions.set(
    `${PREFIX}${key}`,
    JSON.stringify({
      found,
      value,
    }),
    {
      count: ttl ?? DEFAULT_TTL,
    },
  );
}

async function exists(key) {
  const res = await valkey.actions.get(`${PREFIX}${key}`);
  return res !== null && res.found;
}

export default {
  get,
  set,
  exists,
};
