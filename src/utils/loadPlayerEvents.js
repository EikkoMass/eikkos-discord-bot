const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (eventListener) => {
  const files = getAllFiles(path.join(__dirname, 'playerEvents'));

  if(!files) return;

  for(let file of files)
  {
    const event = require(file);
    eventListener.on(event.name, event.callback);
  }
}