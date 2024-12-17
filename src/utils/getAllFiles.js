const fs = require('fs');
const path = require('path');

const getAllFiles = (directory, foldersOnly = false, recursive = false) => {
  let fileNames = [];
  const files = fs.readdirSync(directory, { withFileTypes: true });


  for(const file of files)
  {
    const filePath = path.join(directory, file.name);
    
    if(file.isDirectory() && recursive)
    {
      fileNames.push(...getAllFiles(filePath, foldersOnly, recursive));
    }
    else if(foldersOnly)
    {
      if(file.isDirectory()){
        fileNames.push(filePath);
      }
    } else {
      if(file.isFile())
      {
        fileNames.push(filePath);
      }
    }
  }

  return fileNames;
};

module.exports = getAllFiles;
