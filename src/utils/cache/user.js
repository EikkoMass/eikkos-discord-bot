import valkey from "../authenticators/valkey.js";

const TTL = 60;

export async function get(id) {
  let result = await valkey.actions.get(id);
  return result ? JSON.parse(result) : null;
}

export async function set(key, value) {
  let found = !!value;

  await valkey.actions.set(
    key,
    JSON.stringify({
      found,
      value,
    }),
    {
      count: TTL,
    },
  );
}

export default {
  get,
  set,
};
