let cache = {};

export function get(id) {
  return cache[id];
}

export function set(id, highlight) {
  cache[id] = highlight;
}

export function reset() {
  cache = {};
}

export function resetOne(id) {
  cache[id] = null;
}

export default {
  get,
  set,
  reset,
  resetOne,
};
