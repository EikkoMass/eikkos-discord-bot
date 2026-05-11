import Enum from "../../../enums/notify/aliases.js";
import { getLocalization } from "../../../utils/i18n.js";

export default async function getTypes(interaction) {
  const words = await getLocalization(interaction.locale, `notify`);

  return [
    { name: words.Twitch, value: Enum.TWITCH },
    { name: words.YouTube, value: Enum.YOUTUBE },
    { name: words.Kick, value: Enum.KICK },
  ];
}
