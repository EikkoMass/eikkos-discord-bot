export default (client, eventFiles) => {
  return async (oldPresence, newPresence) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, oldPresence, newPresence);
    }
  };
};
