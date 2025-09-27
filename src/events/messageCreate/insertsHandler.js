import getLocalInserts from "../../utils/importers/getLocalInserts.js";

import { Client, Message } from "discord.js";

const comparatorsCache = {};

/**
 *  @param {Client} client
 *  @param {Message} message
 */
export default async (client, message) => {
  const localInserts = await getLocalInserts();
  try {
    const insertObjects = await filterAsync.call(localInserts, async (cmd) => {
      let type = cmd?.type || "equals";
      let comparator = comparatorsCache[type];

      if (!comparator) {
        try {
          comparator = await importComparator(type);
          comparatorsCache[type] = comparator;
        } catch (err) {
          console.log(`error on insert handler: ${err.message}`);
        }
      }

      return await comparator(message, cmd.match);
    });

    if (!insertObjects?.length) return;

    insertObjects.forEach(
      async (insert) => await insert.callback(client, message),
    );
  } catch (error) {
    console.log(`There was an error running this insert: ${error}`);
  }
};

async function importComparator(type) {
  return (await import(`../../utils/comparators/${type}.js`)).default;
}

async function filterAsync(callback) {
  let filtered = [];

  for (let item of this) {
    if (await callback(item)) filtered.push(item);
  }

  return filtered;
}
