<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="changesText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed">
        <p>{{ changesText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Computed para gerar o texto de alterações
const changesText = computed(() => {
  return `O presente Contrato Promessa traduz e constitui o integral acordo dos Outorgantes relativamente à compra e venda do imóvel identificado na Cláusula Primeira, só podendo ser alterado mediante documento escrito e assinado por todos os Outorgantes.`;
});

// Watch para emitir o texto gerado
watch(
  [changesText],
  ([newChangesText]) => {
    // Emit para o texto completo de alterações
    emit("on-auto-handle-step", {
      name: "changes",
      key: "changes",
      html: newChangesText,
    });
  },
  { immediate: true }
);
</script>
