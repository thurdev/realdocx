<template>
  <div class="flex flex-col flex-1 gap-4">
    <!-- Checkboxes -->
    <div class="flex flex-col gap-2">
      <Label class="text-sm font-medium text-gray-700">
        {{ $t("contracts.clauses") }}
      </Label>
      <div
        v-for="(clause, clauseIndex) in clauses"
        :key="clauseIndex"
        class="flex items-center gap-2"
      >
        <input
          type="checkbox"
          :id="'clause-' + clauseIndex"
          :value="clause"
          v-model="selectedClausules"
          class="h-4 w-4 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          :for="'clause-' + clauseIndex"
          class="text-sm text-gray-700 cursor-pointer"
          >{{ $t(clause.name) }}</label
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import type { Clause } from "./CPCVForm.vue";
import { clauses } from ".";
const { $t } = useNuxtApp();

const selectedClausules = ref<Clause[]>([]);

const emit = defineEmits<{
  onSelectClauses: [Clause[]];
}>();

watch(
  selectedClausules,
  (newValue) => {
    emit("onSelectClauses", newValue);
  },
  { immediate: true }
);
</script>
