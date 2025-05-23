<template>
  <div class="items-top flex gap-x-2">
    <Checkbox id="rgpd" v-model="value" />
    <div class="grid gap-1.5 leading-none">
      <label
        for="rgpd"
        class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        RGPD
      </label>
      <p class="text-sm text-muted-foreground">
        Consente para o tratamento de dados pessoais, conforme o disposto no
        artigo 6.º do Regulamento (UE) 2016/679 do Parlamento Europeu e do
        Conselho, de 27 de abril de 2016, relativo à proteção das pessoas
        singulares no que diz respeito ao tratamento de dados pessoais e à livre
        circulação desses dados.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Clause } from "../CPCVForm.vue";
import { debounce } from "lodash";
import { Checkbox } from "@/components/ui/checkbox";

const props = defineProps<{
  clause: Clause;
}>();

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: Clause & { key: string; value: boolean }
  ): void;
}>();

const value = ref(false);

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
