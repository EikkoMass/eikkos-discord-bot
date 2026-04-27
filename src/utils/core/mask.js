const masks = {
  user: (id) => `<@${id}>`,
  channel: (id) => `<#${id}>`,
  emoji: (name, id) => `<:${name}:${id}>`,
};

export default masks;
