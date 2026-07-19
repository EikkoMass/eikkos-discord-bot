const cache = {};

export function get(identifier, id) {
  if (id)
    return cache[identifier]?.find(
      (cache) => cache.reminder._id.toString() === id,
    );

  return cache[identifier];
}

export function add(identifier, obj) {
  cache[identifier]?.push(obj);
}

export function allocate(identifier) {
  cache[identifier] = [];
}

export function empty(identifier) {
  return !cache[identifier].length;
}

export function remove(identifier, id) {
  cache[identifier].splice(
    cache[identifier].findIndex(
      (cache) => cache.reminder._id.toString() === id.toString(),
    ),
    1,
  );
}

export function reset() {
  cache = {};
}

export default {
  get,
  add,
  allocate,
  remove,
  reset,
  empty,
};
