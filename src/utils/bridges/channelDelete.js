export default (client, eventFiles) => {
  return async (channel) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, channel);
    }
  };
};
