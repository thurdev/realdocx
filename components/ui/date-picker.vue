<template>
  <input
    type="date"
    :value="modelValue.toISOString().split('T')[0]"
    @input="handleInput"
    class="px-3 py-2 border rounded-md text-sm"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: Date;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Date];
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', new Date(target.value));
};
</script> 