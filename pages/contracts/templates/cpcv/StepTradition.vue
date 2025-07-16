<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="traditionText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ traditionText.first }}</p>
        <p><strong>2.</strong> {{ traditionText.second }}</p>
        <p><strong>3.</strong> {{ traditionText.third }}</p>
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

// Computed para gerar o texto da tradição
const traditionText = computed(() => {
  return {
    first: `À Parte Compradora só será concedida plena posse, fruição e gozo do imóvel prometido com a total liquidação do preço e com a realização do Contrato Definitivo de Compra e Venda, através de Cartório Notarial ou em Balcão Casa Pronta ou entidade equiparada, fornecendo a Parte Vendedora, nessa data, à Parte Compradora, todas as chaves de acesso ao imóvel e partes comuns.`,

    second: `A Parte Vendedora compromete-se a manter o imóvel nas condições atualmente existentes, até à data de realização do contrato ora prometido, ressalvadas as deteriorações normais e inerentes a uma prudente utilização.`,

    third: `A Parte Compradora declara que previamente à assinatura do presente contrato visitou o imóvel, pelo que conhece o estado físico e de conservação do mesmo.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [traditionText],
  ([newTraditionText]) => {
    // Emit para o texto completo da tradição
    emit("on-auto-handle-step", {
      name: "tradition",
      key: "tradition",
      html: `${newTraditionText.first} ${newTraditionText.second} ${newTraditionText.third}`,
    });
  },
  { immediate: true }
);
</script>
