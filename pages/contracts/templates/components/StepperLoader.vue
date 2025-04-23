<template>
  <div v-for="i in 4" :key="i" class="flex items-center gap-4 flex-1">
    <Skeleton class="h-10 w-10 rounded-full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-[200px]" />
      <Skeleton class="h-4 w-[160px]" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
