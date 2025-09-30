let cache = {};

export function get(id) {
  return cache[id];
}

export function set(id, functionEvent) {
  cache[id] = functionEvent;
}

export function reset() {
  cache = {};
}

export default {
  get,
  set,
  reset,
};
