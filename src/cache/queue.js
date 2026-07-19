let cache = {};
let search = {};
let timeout = {};

function get(key) {
  return cache[key];
}

function set(key, value, ttl) {
  cache[key] = value;
  search[key] = true;

  create(key, ttl);
}

function searched(key) {
  return search[key];
}

export function reset() {
  cache = {};
  search = {};
}

export function resetOne(id) {
  cache[id] = null;
  search[id] = false;
  cancel(id);
}

function create(key, ttl) {
  if (timeout[key]) {
    clearTimeout(timeout[key]);
  }

  timeout[key] = setTimeout(async () => {
    await event(key);
  }, ttl);
}

async function event(key) {
  await cache[key]?.();
  resetOne(key);
}

function cancel(key) {
  if (timeout[key]) {
    clearTimeout(timeout[key]);
    timeout[key] = null;
  }
}

export default {
  get,
  set,
  searched,
  reset,
  resetOne,
  timeout: {
    cancel,
    create,
  },
};
