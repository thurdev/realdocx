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
    <SidebarContent>
      <template v-for="item in items" :key="item.title">
        <SidebarGroupLabel>
          <h1>
            {{ $t(item.title) }}
          </h1>
        </SidebarGroupLabel>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="link in item.links" :key="link.title">
                <SidebarMenuButton asChild>
                  <a :href="link.url">
                    <component :is="link.icon" />
                    <span>{{ $t(link.title) }}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useWallet } from "~/composable/useWallet";
const { user, clear } = useUserSession();
const { state } = useSidebar();

const items = [
  {
    title: "sidebar.home",
    links: [
      {
        title: "sidebar.dashboard",
        icon: Gauge,
        url: "/dashboard",
      },
    ],
  },
  {
    title: "sidebar.contacts",
    links: [
      {
        title: "sidebar.listContacts",
        icon: Users,
        url: "/contacts",
      },
      {
        title: "sidebar.contactsCreate",
        icon: UserRoundPlus,
        url: "/contacts/create",
      },
    ],
  },

  {
    title: "sidebar.properties",
    links: [
      {
        title: "sidebar.listProperties",
        icon: House,
        url: "/properties",
      },
      {
        title: "sidebar.propertiesCreate",
        icon: HousePlus,
        url: "/properties/create",
      },
    ],
  },
  {
    title: "sidebar.contracts",
    links: [
      {
        title: "sidebar.listContracts",
        icon: File,
        url: "/contracts",
      },
      {
        title: "sidebar.contractsCreate",
        icon: FilePlus,
        url: "/contracts/create",
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
