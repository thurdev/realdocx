<template>
  <div class="flex overflow-hidden max-h-[100dvh]">
    <Sidebar></Sidebar>
    <div class="flex flex-col w-full">
      <Navbar></Navbar>
      <div
        class="p-4 bg-gray-100 dark:bg-zinc-950 min-h-[calc(100dvh-48px)] h-[100%] transition-all duration-500 w-full overflow-auto"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
