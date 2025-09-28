const dirtyWordCache = {
  search: [],
  result: [],
};

export function findResultIndex(key) {
  return dirtyWordCache.result.findIndex((dirty) => dirty.guildId === key);
}

export function findSearchIndex(key) {
  return dirtyWordCache.search.findIndex((dirty) => dirty === key);
}

export function findIndexes(key) {
  return {
    result: findResultIndex(key),
    search: findSearchIndex(key),
  };
}

export function findResult(key) {
  return dirtyWordCache.result.find((dirty) => dirty.guildId === key);
}

export function updateResult(key, content) {
  let attributes = Object.keys(content);
  let index = findResultIndex(key);

  if (index < 0 || !dirtyWordCache?.result[index]) return;

  for (let attribute of attributes) {
    dirtyWordCache.result[index][attribute] = content[attribute];
    console.log(dirtyWordCache.result[index]);
  }
}

export function removeSearchIndex(index) {
  dirtyWordCache.search.splice(index, 1);
}

export function removeResultIndex(index) {
  dirtyWordCache.result.splice(index, 1);
}

export function addResult(obj) {
  dirtyWordCache.result.push(obj);
}

export function existsSearch(key) {
  return dirtyWordCache.result.some((dirty) => dirty === key);
}

export default {
  result: {
    add: addResult,
    find: findResult,
    update: updateResult,
    index: {
      find: findResultIndex,
      remove: removeResultIndex,
    },
  },

  search: {
    exists: existsSearch,
    index: {
      find: findSearchIndex,
      remove: removeSearchIndex,
    },
  },

  index: {
    find: findIndexes,
  },
};
