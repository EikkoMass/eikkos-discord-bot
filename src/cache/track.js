import valkey from "../utils/authenticators/valkey.js";

const TTL = 7200;
const PREFIX = `track:`;

export async function get(id) {
  let result = await valkey.actions.get(`${PREFIX}${id}`);
  return result ? JSON.parse(result) : null;
}

export async function set(key, value) {
  let found = !!value;

  // console.log(`Setting track info cache for ${PREFIX}${key}`);
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

async function exists(key) {
  return (await valkey.actions.get(`${PREFIX}${key}`)) !== null;
}

export async function remove(key) {
  return await valkey.actions.remove(`${PREFIX}${key}`);
}

export default {
  get,
  set,
  exists,
  remove,
};
