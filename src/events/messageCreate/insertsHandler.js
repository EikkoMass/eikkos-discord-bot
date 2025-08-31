import getLocalInserts from '../../utils/getLocalInserts.js';
import comparatorTypes from '../../utils/getComparatorTypes.js';

export default async (client, message) => {

  const localInserts = await getLocalInserts();
  try {

    const insertObject = localInserts.find(cmd => (comparatorTypes[cmd?.type] || comparatorTypes.equals)(message.content, cmd.match));
    if(!insertObject) return;

    await insertObject.callback(client, message);

  } catch (error)
  {
    console.log(`There was an error running this insert: ${error}`);
  }
}