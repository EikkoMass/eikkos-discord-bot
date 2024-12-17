const getAllFiles = require('../utils/getAllFiles');
const functionEvents = require('../utils/getFunctionEvents');
const path = require('path');

module.exports = (client) => {

  const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
  
  for (const eventFolder of eventFolders)
  {
    const eventFiles = getAllFiles(eventFolder, false, true);
    eventFiles.sort((a,b) => a > b);

    const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
    client.on(eventName, (functionEvents[eventName] || functionEvents.default)(client, eventFiles));
  }
};