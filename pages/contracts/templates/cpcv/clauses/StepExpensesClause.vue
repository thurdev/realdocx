<template>
  <div class="flex-1">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Parte responsável pelos encargos
      </label>
      <select
        v-model="value"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-500"
      >
        <option value="">Selecione</option>
        <option value="comprador">Comprador</option>
        <option value="vendedor">Vendedor</option>
        <option value="ambas">Ambas as partes</option>
      </select>
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

const inputValueThrottled = debounce((value: string) => {
  emit("on-extra-clause-value", {
    key: "extra-clause-expenses-party",
    value,
    ...props.clause,
  });
}, 1000);

const value = ref("");

watch(value, (newValue) => inputValueThrottled(newValue));

watch(
  () => props.clause.value,
  (newValue) => {
    if (newValue) value.value = newValue;
  },
  { immediate: true }
);
</script>
