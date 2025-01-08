// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "nuxt-auth-utils",
    "@prisma/nuxt",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  app: {
    head: {
      script: [
        {
          src: "https://kit.fontawesome.com/fc70af23fc.js",
          crossorigin: "anonymous",
        },
      ],
    },
  },
});