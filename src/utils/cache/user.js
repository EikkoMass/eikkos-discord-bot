let userCache = {};

export function get(id) {
  return userCache[id];
}

export function set(id, user) {
  userCache[id] = user;
}

export function reset() {
  userCache = {};
}

export default {
  get,
  set,
  reset,
};
