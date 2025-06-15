const languages = require("../i18n/languages.json");

function getI18n(locale)
{
  return languages[locale] ?? "en";
}

module.exports = locale => getI18n(locale);