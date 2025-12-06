import { getLocalization } from "../../i18n.js";
import Enum from "../../../enums/dirtyWord/types.js";

async function getTypes(interaction) {
  const words = await getLocalization(interaction.locale, `dirty-word`);

  return [
    { name: words.ExactWord, value: Enum.EXACT },
    { name: words.ContainsWord, value: Enum.CONTAINS },
  ];
}

export default getTypes;
