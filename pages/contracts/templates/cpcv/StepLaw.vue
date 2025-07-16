<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="lawText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ lawText.first }}</p>
        <p><strong>2.</strong> {{ lawText.second }}</p>
        <p><strong>3.</strong> {{ lawText.third }}</p>
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

// Computed para gerar o texto de lei aplicável
const lawText = computed(() => {
  return {
    first: `O presente Contrato Promessa de Compra e Venda é exclusivamente regulado pela Lei Portuguesa. No omisso, aplicar-se-ão as disposições legais reguladoras do contrato promessa.`,

    second: `Em caso de desacordo ou litígio relativamente à interpretação, integração e execução do presente Contrato, os Outorgantes diligenciarão no sentido de alcançar, por acordo, uma solução adequada e equitativa.`,

    third: `No caso de não ser possível uma solução negociada e amigável nos termos previstos no número anterior, os Outorgantes acordam que será exclusivamente competente o Tribunal da Comarca da situação do imóvel prometido, cujo foro os Outorgantes aqui convencionam com expressa renúncia a qualquer outro.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [lawText],
  ([newLawText]) => {
    // Emit para o texto completo de lei aplicável
    emit("on-auto-handle-step", {
      name: "law",
      key: "law",
      html: `${newLawText.first} ${newLawText.second} ${newLawText.third}`,
    });
  },
  { immediate: true }
);
</script>
