export default (existing, local) => {
  return areContextDifferent(existing.contexts || [], local.contexts || []);
};

function areContextDifferent(existingContext, localContext) {
  return !existingContext.every(tag => localContext.includes(tag));
}