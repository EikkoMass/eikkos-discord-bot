let cache = {};
let search = {};

export function get(id) {
  return cache[id];
}

export function set(id, highlight) {
  search[id] = true;
  cache[id] = highlight;
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
