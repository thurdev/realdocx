<template>
  <div class="flex-1 space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Parte sujeita à penalização
      </label>
      <select
        v-model="party"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-500"
      >
        <option value="">Selecione</option>
        <option value="comprador">Comprador</option>
        <option value="vendedor">Vendedor</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">
        Valor da penalização (€)
      </label>
      <input
        type="number"
        v-model="amount"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-500"
        placeholder="Ex: 5000"
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

const party = ref("");
const amount = ref("");
const inputValueThrottled = debounce(() => {
  emit("on-extra-clause-value", {
    key: "extra-clause-penalty",
    value: JSON.stringify({ party: party.value, amount: amount.value }),
    ...props.clause,
  });
}, 1000);

watch([party, amount], () => inputValueThrottled());
</script>
