<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="moneyLaunderingText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ moneyLaunderingText.first }}</p>
        <p><strong>2.</strong> {{ moneyLaunderingText.second }}</p>
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

// Computed para gerar o texto de branqueamento de capitais
const moneyLaunderingText = computed(() => {
  return {
    first: `A Parte Compradora declara que qualquer quantia entregue por si no âmbito do presente Contrato, quer a título de reserva, quer a título de sinal ou de pagamento do remanescente do preço, não tem proveniência de qualquer actividade ilícita.`,

    second: `As Partes obrigam-se, no âmbito das disposições legais aplicáveis de natureza preventiva e repressiva do combate ao branqueamento de capitais e ao financiamento do terrorismo, e em relação a todos os actos e operações abrangidas pelo presente Contrato, a prestar a informação relevante, designadamente sobre a identidade dos Outorgantes, dos seus representantes ou dos seus beneficiários efectivos, se aplicável, e dos meios de pagamento das transacções.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [moneyLaunderingText],
  ([newMoneyLaunderingText]) => {
    // Emit para o texto completo de branqueamento de capitais
    emit("on-auto-handle-step", {
      name: "money-laundering",
      key: "money-laundering",
      html: `${newMoneyLaunderingText.first} ${newMoneyLaunderingText.second}`,
    });
  },
  { immediate: true }
);
</script>
