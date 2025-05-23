<template>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <!-- Logo -->
      <div class="flex items-center justify-center h-[48px] gap-2 text-[24px]">
        <h1 class="text-black dark:text-white font-bold">
          <template v-if="state === 'expanded'">
            <i class="fal fa-building"></i>
            Real<label class="text-blue-500">DOCX</label>
          </template>
          <template v-else>
            <p class="text-sm">Real<label class="text-blue-500">X</label></p>
          </template>
        </h1>
      </div>
    </SidebarHeader>
    <SidebarContent class="px-2">
      <template v-for="(item, itemIndex) in items" :key="itemIndex">
        <SidebarMenu>
          <SidebarMenuItem v-for="link in item.links" :key="link.title">
            <SidebarMenuButton asChild>
              <NuxtLink
                :to="link.url"
                :class="[
                  link.url === route.path ? 'bg-blue-500 text-white' : '',
                  'p-4 pb-6 pt-6',
                ]"
              >
                <component class="" :is="link.icon" />
                <span class="font-medium">{{ $t(link.title) }}</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </template>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton class="h-16">
                <div class="flex items-center gap-2 text-left text-sm">
                  <Avatar class="h-8 w-8 rounded-lg">
                    <AvatarImage
                      :src="user?.picture ?? ''"
                      :alt="user?.email"
                    />
                    <AvatarFallback class="rounded-lg">
                      {{ userAvatarFallback(user?.name ?? "") ?? "User" }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{
                        user?.name
                      }}</span>
                    </div>
                    <span class="text-sm">{{ formattedBalance }}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-[--reka-popper-anchor-width]"
            >
              <DropdownMenuItem class="flex items-center flex-row gap-2">
                <p>{{ $t("sidebar.language") }}:</p>
                <div class="flex items-center justify-around gap-2">
                  <Button
                    variant="outline"
                    @click="language = 'pt'"
                    class="p-0 rounded-full relative w-8 h-7"
                  >
                    <img
                      class="w-8 h-7 rounded-full absolute top-0 left-0"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Flag_of_Portugal_%28official%29.svg/509px-Flag_of_Portugal_%28official%29.svg.png"
                    />
                  </Button>

                  <Button
                    variant="outline"
                    @click="language = 'en'"
                    class="p-0 rounded-full relative w-8 h-7"
                  >
                    <img
                      class="w-8 h-7 rounded-full absolute top-0 left-0"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/960px-Flag_of_the_United_Kingdom_%281-2%29.svg.png"
                    />
                  </Button>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem @click="goTo('/settings')">
                <span>{{ $t("sidebar.settings") }}</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="goTo('/wallet')">
                <span>{{ $t("sidebar.wallet") }}</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleLogout">
                <span> {{ $t("sidebar.logout") }} </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import {
  House,
  Users,
  FileText as File,
  UserRoundPlus,
  Gauge,
  HousePlus,
  FilePlus,
} from "lucide-vue-next";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useWallet } from "~/composable/useWallet";
import { useLanguage } from "~/composable/useLanguage";
const { user, clear } = useUserSession();
const { state } = useSidebar();
const language = useLanguage();
const route = useRoute();
const items = [
  {
    links: [
      {
        title: "sidebar.dashboard",
        icon: Gauge,
        url: "/dashboard",
      },
    ],
  },
  {
    links: [
      {
        title: "sidebar.listContacts",
        icon: Users,
        url: "/contacts",
      },
    ],
  },

  {
    links: [
      {
        title: "sidebar.listProperties",
        icon: House,
        url: "/properties",
      },
    ],
  },
  {
    links: [
      {
        title: "sidebar.listContracts",
        icon: File,
        url: "/contracts",
      },
    ],
  },
];

const wallet = useWallet();

onMounted(() => {
  wallet.fetchBalance();
});

const userAvatarFallback = (name: string) => {
  return name.split(" ")?.[0]?.charAt(0) + name.split(" ")?.[1]?.charAt(0);
};

const formattedBalance = computed(() => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(wallet?.balance.value);
});

const handleLogout = async () => {
  await $fetch("/api/auth/logout");
  await clear();
  window.location.href = "/login";
};

const goTo = (path: string) => {
  navigateTo(path);
};
</script>
