<template>
  <div class="flex-1">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Data limite para Escritura
      </label>
      <input
        type="date"
        v-model="value"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clause } from "../CPCVForm.vue";
import { debounce } from "lodash";

const props = defineProps<{
  clause: Clause;
}>();

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: Clause & { key: string; value: string }
  ): void;
}>();

const value = ref("");

watch(value, (newValue) => {
  emit("on-extra-clause-value", {
    key: "extra-clause-deed-deadline-date",
    value: newValue,
    ...props.clause,
  });
});

watch(
  () => props.clause.value,
  (newValue) => {
    if (newValue) {
      value.value = newValue;
    }
  },
  { immediate: true }
);
</script>
