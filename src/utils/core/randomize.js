export default randomize;

export function randomize(seed) {
  if (!seed) return Math.random();

  var x = Math.sin(seed || 1) * 10000;
  return x - Math.floor(x);
}
