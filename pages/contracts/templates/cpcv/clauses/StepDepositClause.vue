<template>
  <div class="flex-1">
    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Valor do sinal</label
      >
      <input
        type="text"
        v-model="value"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-500"
        placeholder="Ex: 5000"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clause } from "../CPCVForm.vue";
import { debounce } from "lodash";

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: Clause & { key: string; value: string }
  ): void;
}>();

const props = defineProps<{
  clause: Clause;
}>();

const inputValueThrottled = debounce(async (value: string) => {
  emit("on-extra-clause-value", {
    key: "extra-clause-deposit-value",
    value: value,
    ...props.clause,
  });
  console.log("Emitted", {
    key: "extra-clause-deposit-value",
    value: value,
    ...props.clause,
  });
}, 1000);

const value = ref("");

watch(value, (newValue) => inputValueThrottled(newValue));

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
