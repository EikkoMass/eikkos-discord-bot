/*
"cache123": {
  "event": () => {}
  "users": [],
}
*/

let cache = {};
let search = {};

function get(key) {
  return cache[key];
}

function set(key, event, users) {
  cache[key] = {
    event: event,
    users: users,
  };

  search[key] = true;
}

function addUser(key, value) {
  if (!cache[key]) return;
  users[key].users.push(value);

  return users[key].users;
}

function removeUser(key, value) {
  if (!cache[key]) return;

  cache[key].users.splice(cache[key].users.indexOf(value), 1);
  if (cache[key].users.length === 0) cache[key].users = null;

  return cache[key].users;
}

function includes(key, value) {
  return cache[key]?.users?.includes(value);
}

function searched(key) {
  return search[key];
}

export function reset() {
  cache = {};
  search = {};
}

export function resetOne(key) {
  cache[key] = null;
  search[key] = false;
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
