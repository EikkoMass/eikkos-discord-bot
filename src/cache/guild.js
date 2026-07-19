let cache = {};
let search = {};

const TTL = 60 * 60 * 1000;

function get(key) {
  return cache[key];
}

function set(key, value) {
  cache[key] = value;
  search[key] = true;

  setTimeout(() => {
    resetOne(key);
  }, TTL);
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
}

export default {
  get,
  set,
  searched,
  reset,
  resetOne,
};
