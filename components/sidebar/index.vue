<template>
  <div
    class="absolute bg-black w-full h-[100dvh] opacity-50 z-[1] md:hidden dark:bg-white/50"
    @click="toggleSidebar"
    :class="{
      block: sidebar,
      hidden: !sidebar,
    }"
  ></div>
  <div
    class="z-[2] md:static md:block min-w-[240px] md:max-w-[240px] md:w-[240px] h-[100dvh] bg-white border-r dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-500"
    :class="{
      hidden: !sidebar,
      absolute: sidebar,
    }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-[48px] gap-2 text-[24px]">
      <i class="fa-sharp fa-light fa-building text-blue-500"></i>
      <label class="font-bold"
        ><span class="text-blue-500">REAL</span
        ><span class="dark:text-white">DOCX</span></label
      >
    </div>

    <!-- Sidebar Items -->
    <div class="mt-4">
      <ul class="flex flex-col">
        <NuxtLink
          v-for="(item, index) in sidebarItems"
          :key="index"
          class="flex items-center gap-4 p-2 pl-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-white"
          :class="{
            'border-r-4 border-blue-500 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 ':
              $route.path === item.link,
          }"
          :to="item.link"
        >
          <i :class="item.icon"></i>
          {{ $t(item.title) }}
        </NuxtLink>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composable/useSidebar";
import { $t } from "~/i18n";
const sidebar = useSidebar();
const toggleSidebar = () => {
  sidebar.value = !sidebar.value;
};

const sidebarItems = [
  {
    title: "sidebar.cpcv",
    icon: "fa-light fa-file-word",
    link: "/cpcv",
  },
  {
    title: "sidebar.subscriptions",
    icon: "fa-light fa-money-check-dollar",
    link: "/subscriptions",
  },
];
</script>
