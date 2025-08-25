import languages from "../i18n/languages.json" with { type: 'json' };
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
export function formatMessage(message = "", values = [])
{
  if(!values?.length) return message;

  let content = message;

  values.forEach((value, index) => {
    content = content.replace(`{${index}}`, value);
  });

  return content;
}

export async function getLocalization(locale, context)
{
  return (await import(`../i18n/${getI18n(locale)}/${context}.json`, { with: { type: 'json' } })).default;
}

export default {
  formatMessage,
  getLocalization,
};