export default (client, eventFiles) => {
  return async (interaction) => {
    for (const eventFile of eventFiles) {
      const eventFunction = (await import(eventFile)).default;
      await eventFunction(client, interaction);
    }
  };
};
