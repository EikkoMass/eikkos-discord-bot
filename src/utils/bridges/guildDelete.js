export default (client, eventFiles) => {
  return async (guild) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, guild);
    }
  };
};
