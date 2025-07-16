<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="recognitionText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed">
        <p>{{ recognitionText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from "vue";

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Computed para gerar o texto de reconhecimento
const recognitionText = computed(() => {
  return `Nos termos e para os efeitos do disposto do artigo 410.º do Código Civil, as assinaturas apostas no presente Contrato gozarão de reconhecimento presencial por entidade legalmente habilitada para o efeito.`;
});

// Watch para emitir o texto gerado
watch(
  [recognitionText],
  ([newRecognitionText]) => {
    // Emit para o texto completo de reconhecimento
    emit("on-auto-handle-step", {
      name: "recognition",
      key: "recognition",
      html: newRecognitionText,
    });
  },
  { immediate: true }
);
</script>
