<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="rgpdText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed">
        <p>{{ rgpdText }}</p>
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

// Computed para gerar o texto RGPD
const rgpdText = computed(() => {
  return `Os Outorgantes declaram, ao abrigo do RGPD - Regulamento Geral sobre a Protecção de Dados, que prestam consentimento de forma livre, específica e informativa para que os dados pessoais sejam introduzidos e tratados, nas bases de dados de controlo e reporte de transações, destinados apenas a autoridades judiciais, tributárias ou administrativas, profissionais sujeitos às regras deontológicas dos Estatutos da Ordem dos Advogados e dos Estatutos da Ordem dos Solicitadores e dos Agentes de Execução e, ainda, aos profissionais de intermediação imobiliária.`;
});

// Watch para emitir o texto gerado
watch(
  [rgpdText],
  ([newRgpdText]) => {
    // Emit para o texto completo RGPD
    emit("on-auto-handle-step", {
      name: "rgpd",
      key: "rgpd",
      html: newRgpdText,
    });
  },
  { immediate: true }
);
</script>
