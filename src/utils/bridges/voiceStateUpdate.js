export default (client, eventFiles) => {
  return async (oldstate, newstate) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, oldstate, newstate);
    }
  };
};
