import { ButtonStyle } from "discord.js";

import { getLocalization } from "../utils/i18n.js";

async function getTypes(interaction) {
  const words = await getLocalization(interaction.locale, `buttons`);

  return [
    { name: words.Primary, value: ButtonStyle.Primary },
    { name: words.Secondary, value: ButtonStyle.Secondary },
    { name: words.Success, value: ButtonStyle.Success },
    { name: words.Danger, value: ButtonStyle.Danger },
  ];
}

export default getTypes;
