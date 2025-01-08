// Example: ./translations.json
// {
//   "sidebar": {
//     "home": {
//       "en-GB": "Home",
//       "pt-PT": "Início"
//     }
//   }
// }

import translations from "./translations.json";

export const $t = (key: string, locale?: string) => {
  if (!locale && navigator?.language) {
    // Try to get the locale from the browser
    locale = navigator?.language?.split("-")?.[0];
  }

  if (!locale) {
    // Default locale
    locale = "en";
  }

  try {
    const keys = key.split(".");
    let value = translations as any;
    for (const k of keys) {
      if (value[k]) {
        value = value[k];
      } else {
        console.error(`Translation key "${key}" not found.`);
        return key;
      }
    }
    return value[locale] || key;
  } catch (error) {
    console.error(`Error loading translations: ${error}`);
    return key;
  }
};
