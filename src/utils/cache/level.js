import valkey from "../authenticators/valkey.js";

const DEFAULT_TTL = 60 * 60 * 24;

async function get(key) {
  let result = await valkey.actions.get(`level:${key}`);
  return result ? JSON.parse(result) : null;
}

async function set(key, value, ttl) {
  let found = !!value;

  await valkey.actions.set(
    `level:${key}`,
    JSON.stringify({
      found,
      value,
    }),
    {
      count: ttl ?? DEFAULT_TTL,
    },
  );
}

export default {
  get,
  set,
};
