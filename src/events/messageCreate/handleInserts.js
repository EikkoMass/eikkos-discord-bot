const getLocalInserts = require('../../utils/getLocalInserts');
const comparatorTypes = require('../../utils/getComparatorTypes');

module.exports = async (client, message) => {

  const localInserts = getLocalInserts();
  try {

    const insertObject = localInserts.find(cmd => (comparatorTypes[cmd?.type] || comparatorTypes.equals)(message.content, cmd.match));
    if(!insertObject) return;

    await insertObject.callback(client, message);

  } catch (error)
  {
    console.log(`There was an error running this insert: ${error}`);
  }
}