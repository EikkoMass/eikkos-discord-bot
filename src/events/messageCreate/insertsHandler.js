import getLocalInserts from '../../utils/getLocalInserts.js';
import comparatorTypes from '../../utils/getComparatorTypes.js';

import { Client, Message } from 'discord.js';

/**
 *  @param {Client} client
 *  @param {Message} message
*/
export default async (client, message) => {

  const localInserts = await getLocalInserts();
  try {

    const insertObjects = localInserts.filter(cmd => (comparatorTypes[cmd?.type] || comparatorTypes.equals)(message.content, cmd.match));
    if(!insertObjects?.length) return;

    insertObjects.forEach(async insert => await insert.callback(client, message));
  } catch (error)
  {
    console.log(`There was an error running this insert: ${error}`);
  }
}