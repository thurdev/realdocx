<template>
  <div class="flex-1">
    <p class="text-sm text-gray-700">
      O imóvel será entregue livre de quaisquer ônus ou encargos até à data da
      escritura.
    </p>
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

// Não há input, mas podes emitir um valor default só para consistência:
emit("on-extra-clause-value", {
  key: "extra-clause-onus",
  value: "livre de ônus",
  ...props.clause,
});
</script>
