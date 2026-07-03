import valkey from "../authenticators/valkey.js";

const TTL = 60;
const PREFIX = `user:`;

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
