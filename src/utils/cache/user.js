let userCache = {};

let autoCleanTimeout;
let CLEAN_INTERVAL = 60000;

export function get(id) {
  return userCache[id];
}

export function set(id, user) {
  userCache[id] = user;

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

export default {
  get,
  set,
  reset,
};
