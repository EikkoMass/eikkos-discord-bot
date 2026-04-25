import Enum from "../../../enums/minecraft/editions.js";
import { getLocalization } from "../../../utils/i18n.js";

export default async function getTypes(interaction) {
  const words = await getLocalization(interaction.locale, `minecraft`);

  return [
    { name: words.JavaEdition, value: Enum.JAVA },
    { name: words.BedrockEdition, value: Enum.BEDROCK },
  ];
}
