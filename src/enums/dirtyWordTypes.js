import { getLocalization } from '../utils/i18n.js';

async function getTypes(interaction)
{
  const words = await getLocalization(interaction.locale, `dirty-word`);

  return [
    { name: words.ExactWord, value: 0 },
    { name: words.ContainsWord, value: 1 },
  ];
}

export default getTypes;