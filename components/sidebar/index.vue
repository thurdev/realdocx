<template>
  <div
    class="absolute bg-black w-full h-[100dvh] opacity-50 z-[1] md:hidden"
    @click="toggleSidebar"
    :class="{
      block: sidebar,
      hidden: !sidebar,
    }"
  ></div>
  <div
    class="z-[2] md:translate-x-0 md:static min-w-[240px] md:max-w-[240px] md:w-[240px] h-[100dvh] bg-white border-r dark:border-zinc-800 dark:bg-sidebar transition-all duration-500"
    :class="{
      'translate-x-0 fixed top-[0]': sidebar,
      '-translate-x-full fixed top-[0]': !sidebar,
    }"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center h-[48px] gap-2 text-[24px]">
      <h1 class="text-black dark:text-white font-bold">
        <i class="fal fa-building"></i>
        Real<label class="text-blue-500">DOCX</label>
      </h1>
    </div>

    <!-- Sidebar Items -->
    <div class="mt-4 flex flex-col w-full h-[calc(100%-48px-16px)]">
      <div
        v-for="(group, groupIndex) in sidebarItems"
        :key="groupIndex"
        class="pl-4 pr-4"
      >
        <ul class="flex flex-col gap-2 pt-2">
          <NuxtLink
            v-for="(item, index) in group.links"
            :key="index"
            class="flex items-center gap-4 p-1 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-sidebar-accent/80 dark:text-white"
            :class="[`tour-target-${item.tourTarget}`, {
              'border-r-4 border-blue-500 bg-gray-100 hover:bg-gray-200 dark:bg-sidebar-accent !text-blue-500':
                route.path === item.link,
              
            }]"
            :to="item.link"
          >
            <Button class="w-4" variant="invisible">
              <i :class="item.icon"></i>
            </Button>
            {{ $t(item.title) }}
          </NuxtLink>
        </ul>
      </div>

      <div
        class="w-full h-[64px] mt-auto p-2 pl-4 pr-4 flex items-center hover:bg-gray-100 dark:hover:bg-sidebar-accent hover:cursor-pointer"
      >
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <div
              style="
                width: 100%;
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                align-items: center;
              "
            >
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="user?.picture ?? ''" alt="User" />
                <AvatarFallback>{{
                  userAvatarFallback(user?.name ?? "") ?? "User"
                }}</AvatarFallback>
              </Avatar>
              <div
                class="dark:text-white flex items-center justify-between w-full"
              >
                <div class="truncate text-xs">
                  {{ user?.name }}
                </div>
                <div>
                  <i class="fal fa-angles-up-down"></i>
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          >
            <DropdownMenuLabel class="p-0 font-normal">
              <div
                class="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
              >
                <Avatar class="h-8 w-8 rounded-lg">
                  <AvatarImage :src="user?.picture ?? ''" :alt="user?.email" />
                  <AvatarFallback class="rounded-lg">
                    {{ userAvatarFallback(user?.name ?? "") ?? "User" }}
                  </AvatarFallback>
                </Avatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ user?.name }}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem class="cursor-pointer flex justify-between">
                <div class="fllex">
                  <i class="fa-light fa-globe"></i>
                  {{ $t("sidebar.language") }}:
                </div>
                <div class="flex gap-1">
                  <Button @click="setLanguage('pt')" variant="outline" size="sm"
                    ><span class="text-xl">🇵🇹</span></Button
                  >
                  <Button @click="setLanguage('en')" variant="outline" size="sm"
                    ><span class="text-xl"> 🇬🇧 </span></Button
                  >
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleThemeMode" class="cursor-pointer">
                <template v-if="colorMode.preference === 'dark'">
                  <i class="fa-light fa-moon" />
                  {{ $t("sidebar.dark") }}
                </template>
                <template v-else>
                  <i class="fa-light fa-sun-bright" />
                  {{ $t("sidebar.light") }}
                </template>
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="goTo('/settings')"
                class="cursor-pointer"
              >
                <i class="fa-light fa-cog" />
                {{ $t("sidebar.settings") }}
              </DropdownMenuItem>
              <DropdownMenuItem
                @click="goTo('/wallet')"
                class="cursor-pointer"
              >
                <i class="fa-light fa-credit-card" />
                {{ $t("sidebar.wallet") }}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer" @click="handleLogout">
              <i class="fal fa-right-from-bracket"></i>
              {{ $t("sidebar.logout") }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, clear } = useUserSession();
import { useSidebar } from "~/composable/useSidebar";
import { useLanguage } from "~/composable/useLanguage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
const colorMode = useColorMode();
const route = useRoute();
const sidebar = useSidebar();
const language = useLanguage();
const toggleSidebar = () => {
  sidebar.value = !sidebar.value;
};

const sidebarItems = [
  {
    links: [
      {
        title: "sidebar.contacts",
        icon: "fa-light fa-users",
        link: "/contacts",
        tourTarget: "sidebar-contacts",
      },

      {
        title: "sidebar.properties",
        icon: "fa-light fa-building",
        link: "/properties",
        tourTarget: "sidebar-properties",
      },
      {
        title: "sidebar.contracts",
        icon: "fa-light fa-file-word",
        link: "/contracts",
        tourTarget: "sidebar-contracts",
      },
    ],
  },
];

const handleThemeMode = () => {
  colorMode.preference === "dark"
    ? (colorMode.preference = "light")
    : (colorMode.preference = "dark");
};

const handleLogout = async () => {
  await $fetch("/api/auth/logout");
  await clear();
  window.location.href = "/login";
};

const goTo = (path: string) => {
  navigateTo(path);
};

const setLanguage = (lang: string) => {
  language.value = lang;
};

const userAvatarFallback = (name: string) => {
  return name.split(" ")?.[0]?.charAt(0) + name.split(" ")?.[1]?.charAt(0);
};
</script>
