import valkey from "../utils/authenticators/valkey.js";

const TTL = 86400; // 1 day
const PREFIX = `daily:`;

export async function get(id) {
  let result = await valkey.actions.get(`${PREFIX}${id}`);
  return result ? JSON.parse(result) : null;
}

export async function set(key, value) {
  let found = !!value;

  await valkey.actions.set(
    `${PREFIX}${key}`,
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
