<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="nonAcomplianceText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ nonAcomplianceText.first }}</p>
        <p><strong>2.</strong> {{ nonAcomplianceText.second }}</p>
        <p><strong>3.</strong> {{ nonAcomplianceText.third }}</p>
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

// Computed para gerar o texto de não cumprimento
const nonAcomplianceText = computed(() => {
  return {
    first: `Em caso de incumprimento definitivo do presente Contrato Promessa de Compra e Venda imputável à Parte Compradora, terá a Parte Vendedora direito de resolver imediatamente o presente Contrato e de fazer suas todas as quantias recebidas a título de sinal e princípio de pagamento.`,

    second: `Em caso de incumprimento definitivo do presente Contrato Promessa de Compra e Venda imputável à Parte Vendedora, terá a Parte Compradora direito de resolver imediatamente o presente Contrato e de receber as quantias pagas a título de sinal e princípio de pagamento em dobro.`,

    third: `A Parte não faltosa, em caso de incumprimento e em alternativa à resolução do Contrato, poderá optar pelo regime de execução específica previsto no artigo 830.º do Código Civil.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [nonAcomplianceText],
  ([newNonAcomplianceText]) => {
    // Emit para o texto completo de não cumprimento
    emit("on-auto-handle-step", {
      name: "non-acompliance",
      key: "non-acompliance",
      html: `${newNonAcomplianceText.first} ${newNonAcomplianceText.second} ${newNonAcomplianceText.third}`,
    });
  },
  { immediate: true }
);
</script>
