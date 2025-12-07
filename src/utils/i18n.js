import path from "path";

import languages from "../i18n/languages.json" with { type: "json" };
const defaultLanguage = "en";

const localizationCache = {};

/**
 * @param {String} locale
 */
function getI18n(locale) {
  return languages[locale] ?? defaultLanguage;
}

/**
 * @param {String} message
 * @param {Array} values
 */
export function formatMessage(message = "", values = []) {
  if (!values?.length) return message;

  let content = message;

  values.forEach((value, index) => {
    content = content.replace(`{${index}}`, value);
  });

  return content;
}

export async function getLocalization(locale, context) {
  const contextPath = path.join(getI18n(locale), context);

  if (localizationCache[contextPath]) return localizationCache[contextPath];

  const localization = (
    await import(
      path.join(import.meta.dirname, "..", "i18n", `${contextPath}.json`),
      {
        with: { type: "json" },
      }
    )
  ).default;

  localizationCache[contextPath] = localization;

  return localization;
}

export default {
  formatMessage,
  getLocalization,
};
