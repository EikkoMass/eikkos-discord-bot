let cache = {};
let users = {};
let search = {};

function get(key) {
  return cache[key];
}

function set(key, value) {
  cache[key] = value;
  search[key] = true;
}

function addUser(key, value) {
  if (!users[key]) users[key] = [];
  users[key].push(value);

  return users[key];
}

function removeUser(key, value) {
  users[key].splice(users[key].indexOf(value), 1);
  if (users[key].length === 0) users[key] = null;

  return users[key];
}

function includes(key, value) {
  return users[key]?.includes(value);
}

function searched(key) {
  return search[key];
}

export function reset() {
  cache = {};
  search = {};
}

export function resetOne(id) {
  cache[id] = null;
  search[id] = false;
}

export default {
  get,
  set,
  addUser,
  removeUser,
  includes,
  searched,
  reset,
  resetOne,
};
