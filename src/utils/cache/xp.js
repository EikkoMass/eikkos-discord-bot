import valkey from "../authenticators/valkey.js";

const DEFAULT_TTL = 6;

async function get(key) {
  let result = await valkey.actions.get(key);
  return result ? JSON.parse(result) : null;
}

async function set(key, value, ttl) {
  let found = !!value;

  await valkey.actions.set(
    key,
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
  let cache = await get(key);
  return cache !== null && cache.found;
}

export default {
  get,
  set,
  exists,
};
