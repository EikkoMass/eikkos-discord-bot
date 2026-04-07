export default (client, eventFiles) => {
  return async (reaction, user) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, reaction, user);
    }
  };
};
