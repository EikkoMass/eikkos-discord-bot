let search = {};
let cache = {};

let autoCleanTimeout;
let TTL = 60 * 60 * 1000;

export function get(key) {
  return cache[key];
}

export function searched(key) {
  return search[key];
}

export function set(key, value) {
  cache[key] = value;
  search[key] = value;

  if (!autoCleanTimeout) {
    autoCleanTimeout = setTimeout(() => {
      autoCleanTimeout = null;
      reset();
    }, TTL);
  }
}

export function addWord(key, value) {
  if (!cache[key]) cache[key] = [];
  cache[key].push(value);
}

export function removeWord(key, value) {
  if (!cache[key]?.length) reset(key);
  cache[key].splice(cache[key].indexOf(value), 1);
}

export function resetOne(key) {
  cache[key] = null;
  search[key] = false;
}

export function reset() {
  cache = {};
  search = {};
}

export default {
  get,
  set,
  searched,
  resetOne,
  addWord,
  removeWord,
  reset,
};
