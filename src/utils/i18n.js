const languages = require("../i18n/languages.json");
const defaultLanguage = "en";

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
function formatMessage(message, values = [])
{
  if(!values?.length) return message;

  let content = message;

  values.forEach((value, index) => {
    content = content.replace(`{${index}}`, value);
  });

  return content;
}

exports.getI18n = getI18n;
exports.formatMessage = formatMessage; 

module.exports = {
  getI18n,
  formatMessage,
};