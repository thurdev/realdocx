<script setup lang="ts">
import { cn } from '@/lib/utils'
import { TabsList, type TabsListProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <TabsList
    v-bind="delegatedProps"
    :class="cn(
      'inline-flex items-center justify-center rounded-md bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>
