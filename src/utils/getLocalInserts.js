const fs = require('fs');
const path = require('path');

module.exports = (exceptions = []) => {
  let localInserts = [];
  const mainPath = path.join(__dirname, '..', 'inserts');
  const files = fs.readdirSync(mainPath);
  for(const file of files)
  {    
      const insertObject = require(`${mainPath}/${file}`);
      
      if(exceptions.includes(insertObject.name)) continue;
      
      localInserts.push(insertObject);
  }

  return localInserts;
}