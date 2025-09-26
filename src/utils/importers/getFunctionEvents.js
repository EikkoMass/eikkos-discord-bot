const importEvent = async eventFile => (await import(eventFile)).default;

export default {
  default: (client, eventFiles) => {
      return async (interaction) => {
        for(const eventFile of eventFiles)
        {
          const eventFunction = await importEvent(eventFile);
          await eventFunction(client, interaction);
        }
      }
    },
    presenceUpdate: (client, eventFiles) => {
      return async (oldPresence, newPresence) => {
        for(const eventFile of eventFiles)
        {
          const eventFunction = await importEvent(eventFile);
          await eventFunction(client, oldPresence, newPresence);
        }
      }
    },
    messageCreate: (client, eventFiles) => {
      return async message => {
        for(const eventFile of eventFiles)
          {
            const eventFunction = await importEvent(eventFile);
            await eventFunction(client, message);
          }
      }
    }
  };
  