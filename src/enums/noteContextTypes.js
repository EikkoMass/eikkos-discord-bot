import { getLocalization } from '../utils/i18n.js';


async function getTypes(interaction)
{
  const words = await getLocalization(interaction.locale, `context-types`);

  return [
    { name: words.Private, value: 1 },
    { name: words.Public, value: 2 },
  ];
}

export default getTypes;