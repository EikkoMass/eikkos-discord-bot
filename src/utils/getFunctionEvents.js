module.exports = {
  default: (client, eventFiles) => {
      return async (interaction) => {
        for(const eventFile of eventFiles)
        {
          const eventFunction  = require(eventFile);
          await eventFunction(client, interaction);
        }
      }
    },
    presenceUpdate: (client, eventFiles) => {
      return async (oldPresence, newPresence) => {
        for(const eventFile of eventFiles)
        {
          const eventFunction  = require(eventFile);
          await eventFunction(client, oldPresence, newPresence);
        }
      }
    },
    messageCreate: (client, eventFiles) => {
      return async message => {
        for(const eventFile of eventFiles)
          {
            const eventFunction  = require(eventFile);
            await eventFunction(client, message);
          }
      }
    }
  };
  