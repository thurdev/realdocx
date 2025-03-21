// types/nuxt.d.ts
import { NuxtApp } from "nuxt/app";

declare module "nuxt/app" {
  interface NuxtApp {
    $t: (key: string, params?: any[], locale?: string) => string;
  }
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: (key: string, params?: any[], locale?: string) => string;
  }
}

/// Vue 3 Component
declare module "spline-vue/v3" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
