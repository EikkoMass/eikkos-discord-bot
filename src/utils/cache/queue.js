let cache = {};
let search = {};
let timeout = {};

function get(key) {
  return cache[key];
}

function set(key, value, ttl) {
  cache[key] = value;
  search[key] = true;

  newTimeout(key, ttl);
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
  cancelTimeout(id);
}

function newTimeout(key, ttl) {
  if (timeout[key]) {
    clearTimeout(timeout[key]);
  }

  timeout[key] = setTimeout(() => {
    cache[key]?.();
    resetOne(key);
  }, ttl);
}

function cancelTimeout(key) {
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
  cancelTimeout,
  newTimeout,
};
