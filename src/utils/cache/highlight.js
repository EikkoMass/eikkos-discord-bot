let cache = {};
let search = {};

let autoCleanTimeout;
let CLEAN_INTERVAL = 60000;

export function get(id) {
  return cache[id];
}

export function set(id, highlight) {
  search[id] = true;
  cache[id] = highlight;

  if (!autoCleanTimeout) {
    autoCleanTimeout = setTimeout(() => {
      autoCleanTimeout = null;
      reset();
    }, CLEAN_INTERVAL);
  }
}

export function reset() {
  cache = {};
  search = {};
}

export function resetOne(id) {
  cache[id] = null;
  search[id] = false;
}

export function searched(id) {
  return search[id];
}

export default {
  get,
  set,
  reset,
  resetOne,
  searched,
};
