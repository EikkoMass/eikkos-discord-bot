let cache = {};
let search = {};

function get(key) {
  return cache[key];
}

function set(key, value) {
  cache[key] = value;
  search[key] = true;
}

function resetOne(key) {
  cache[key] = null;
  search[key] = false;
}

function reset() {
  cache = {};
  search = {};
}

function searched(key) {
  return search[key];
}

export default {
  get,
  set,
  resetOne,
  reset,
  searched,
};
