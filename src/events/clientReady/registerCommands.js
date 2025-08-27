import config from '../../../config.json' with { type: 'json' };
import getLocalCommands from '../../utils/getLocalCommands.js';
import getApplicationCommands from '../../utils/getApplicationCommands.js';
import areCommandsDifferent from '../../utils/areCommandsDifferent.js';

export default async (client) => {
  try {
    const localCommands = await getLocalCommands();
    // Add testServer as a second parameter if you want to register only on a specific guild
    const applicationCommands = await getApplicationCommands(client, config.testServer);

    for(const localCommand  of localCommands)
    {
      const {name, description, options} = localCommand;
      const existingCommand = await applicationCommands.cache.find(cmd => cmd.name === name);
    
      if(existingCommand)
      {
        if(localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
          continue;
        }

        if(areCommandsDifferent(existingCommand, localCommand))
        {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
  
          console.log(`Edited command ${name}`);
        } 
      }
      else {
        if (localCommand.deleted)
        {
          console.log(`Skipping registering command "${name}" as it's set to delete`);
          continue;
        }

        await applicationCommands.create({
          name,
          description,
          options,
        });

        console.log(`Registered command ${name}`);
      }
    }
  } catch (error) {
    console.log(`There was an error: ${error}`)
  }
}