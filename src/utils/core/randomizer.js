export default {
  getSeeded,
  getRandom,
};

export function getSeeded(seed) {
  if (!seed) return Math.random();

  var x = Math.sin(seed || 1) * 10000;
  return x - Math.floor(x);
}

export function getRandom(min = 0, max = 100) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
