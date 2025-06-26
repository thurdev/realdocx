<template>
  <div
    class="flex justify-end self-end gap-2 fixed right-[1rem] bottom-[1rem] p-2 rounded"
  >
    {{ currentStep }}
    <Button
      v-if="currentStep >= 0"
      class="mt-4"
      variant="ghost"
      @click="() => emits('back', prevStep)"
    >
      {{ $t("shared.back") }}
    </Button>
    <Button
      class="mt-4"
      :disabled="disabled"
      @click="() => emits('next', () => nextStep())"
    >
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      {{ buttonNextLabel }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";

const props = defineProps<{
  nextStep: () => void;
  prevStep: () => void;
  currentStep: number;
  disabled: boolean;
  isLoading: boolean;
  buttonNextLabel: string;
}>();

const emits = defineEmits<{
  next: [Function];
  back: [Function];
}>();
</script>
