import fs from 'fs';
import path from 'path';

export default async(exceptions = []) => {
  let autocompletes = [];
  const mainPath = path.join(import.meta.dirname, '..', 'autocompletes');
  const files = fs.readdirSync(mainPath);
  for(const file of files)
  {    
      const autocompleteObject = (await import(`${mainPath}/${file}`)).default;
      
      if(exceptions.includes(autocompleteObject.name)) continue;
      
      autocompletes.push(autocompleteObject);
  }

  return autocompletes;
}