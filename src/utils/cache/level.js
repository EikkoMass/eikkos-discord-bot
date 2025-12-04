let cache = {};

let autoCleanTimeout;
let CLEAN_INTERVAL = 1000 * 60 * 60 * 24; // 1 day

function get(id) {
  return cache[id];
}

function set(id, value) {
  cache[id] = value;

  if (!autoCleanTimeout) {
    autoCleanTimeout = setTimeout(() => {
      autoCleanTimeout = null;
      clear();
    }, CLEAN_INTERVAL);
  }
}

function clear() {
  cache = {};
}

export default {
  get,
  set,
};
