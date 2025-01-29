// plugins/i18n.ts
import translations from "@/i18n/translations.json";
import { useLanguage } from "@/composable/useLanguage";

export default defineNuxtPlugin({
  name: "i18n",
  enforce: "pre", // or 'post'
  async setup(nuxtApp) {
    const language = useLanguage();

    const $t = (key: string, locale?: string) => {
      if (!key) return "";
      locale = locale || language.value;
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

    // Make $t available globally
    nuxtApp.provide("t", $t);
  },
  hooks: {
    "app:created"() {
      const nuxtApp = useNuxtApp();
      // do something in the hook
    },
  },
  env: {},
});
