let userCache = {};
let search = {};

let autoCleanTimeout;
let CLEAN_INTERVAL = 60 * 1000;

export function get(id) {
  return userCache[id];
}

export function set(key, value) {
  userCache[key] = value;
  search[key] = true;

  if (!autoCleanTimeout) {
    autoCleanTimeout = setTimeout(() => {
      autoCleanTimeout = null;
      reset();
    }, CLEAN_INTERVAL);
  }
}

export function reset() {
  userCache = {};
}

export function resetOne(key) {
  userCache[key] = null;
  search[key] = false;
}

export function searched(key) {
  return search[key];
}

export default {
  get,
  set,
  reset,
  resetOne,
  searched,
};
