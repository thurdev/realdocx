<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "~/components/sidebar/Sidebar.vue";
import Toaster from "@/components/ui/toast/Toaster.vue";
</script>

<template>
  <Toaster />
  <SidebarProvider>
    <Sidebar />
    <main class="flex flex-col w-full p-4">
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>
