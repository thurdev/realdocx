// types/nuxt.d.ts
import { NuxtApp } from "nuxt/app";

declare module "nuxt/app" {
  interface NuxtApp {
    $t: (key: string, locale?: string) => string;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: (key: string, locale?: string) => string;
  }
}
