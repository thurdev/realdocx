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
    "nuxt-vue3-google-signin",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
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
        {
          src: "https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js",
          type: "module",
        },
        {
          src: "https://accounts.google.com/gsi/client",
          async: true,
          defer: true
        }
      ],
    },
  },
  googleSignIn: {
    clientId:
      "1095108654667-4basuj8t8uiu2e0dft50ofij4olbc0q0.apps.googleusercontent.com"
  },
  vue: {
    // custom element
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("spline-viewer"),
    },
  },
});