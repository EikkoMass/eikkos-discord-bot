export default (client, eventFiles) => {
  return async (message) => {
    for (const eventFile of eventFiles) {
      const eventFunction = await (await import(eventFile)).default;
      await eventFunction(client, message);
    }
  };
};
