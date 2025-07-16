<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="declarationsText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ declarationsText.first }}</p>
        <p><strong>2.</strong> {{ declarationsText.second }}</p>
        <p><strong>3.</strong> {{ declarationsText.third }}</p>
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

// Computed para gerar o texto de declarações
const declarationsText = computed(() => {
  return {
    first: `O presente contrato é assinado por ambas as Partes na sua boa-fé, declarando a Parte Vendedora, que, relativamente ao imóvel em causa, não existe, nem se prevê que venha a existir qualquer litígio judicial ou extrajudicial.`,

    second: `A Parte Vendedora declara que não existem notificações, municipais ou outras, motivadas por quaisquer intervenções no imóvel prometido, que possam afetar ou comprometer a plena validade e eficácia do presente contrato promessa, o valor do imóvel, seu uso ou a sua atual composição, nem quaisquer ónus, encargos, contratos ou direitos de terceiros que afetem ou possam afetar o futuro direito de propriedade plena da Parte Compradora, além dos referidos no presente contrato.`,

    third: `Declaram as Partes que têm conhecimento que a existência de qualquer dívida para com a Administração Pública, impedirá a emissão das guias dos impostos necessárias para a realização do contrato ora prometido.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [declarationsText],
  ([newDeclarationsText]) => {
    // Emit para o texto completo de declarações
    emit("on-auto-handle-step", {
      name: "declarations",
      key: "declarations",
      html: `${newDeclarationsText.first} ${newDeclarationsText.second} ${newDeclarationsText.third}`,
    });
  },
  { immediate: true }
);
</script>
