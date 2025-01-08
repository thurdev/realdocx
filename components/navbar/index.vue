<template>
  <div
    class="w-full h-[48px] min-h-[48px] flex items-center justify-between pl-2 pr-2 bg-white border-b dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-500"
  >
    <div>
      <Button
        variant="ghost"
        class="dark:text-white md:hidden"
        @click="toggleSidebar"
      >
        <i class="fa-light fa-bars"></i>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from "~/composable/useSidebar";

const colorMode = useColorMode();

const handleThemeMode = () => {
  colorMode.preference === "dark"
    ? (colorMode.preference = "light")
    : (colorMode.preference = "dark");
};

const toggleSidebar = () => {
  useSidebar().value = !useSidebar().value;
};
</script>
