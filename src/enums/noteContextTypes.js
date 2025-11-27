import { getLocalization } from "../utils/i18n.js";
import Enum from "./noteContextEnum.js";

async function getTypes(interaction) {
  const words = await getLocalization(interaction.locale, `context-types`);

  return [
    { name: words.Private, value: Enum.PRIVATE },
    { name: words.Public, value: Enum.PUBLIC },
  ];
}

export default getTypes;
