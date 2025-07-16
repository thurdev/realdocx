<template>
  <div class="space-y-6">
    <!-- Seção de Despesas -->

    <!-- Preview do texto gerado -->
    <div v-if="expensesText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ expensesText.first }}</p>
        <p><strong>2.</strong> {{ expensesText.second }}</p>
        <p><strong>3.</strong> {{ expensesText.third }}</p>
        <p><strong>4.</strong> {{ expensesText.fourth }}</p>
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

// Computed para gerar o texto das despesas
const expensesText = computed(() => {
  return {
    first: `Correm por conta da Parte Compradora o pagamento de todas as despesas e encargos notariais, registais e tributários decorrentes do presente Contrato Promessa e da celebração do Contrato Definitivo de Compra e Venda, designadamente, custo da escritura, registos provisórios ou definitivos, Imposto do Selo e IMT - Imposto Municipal sobre Transmissões Onerosas de Imóveis, se houver lugar ao seu pagamento.`,

    second: `Correm por conta da Parte Vendedora todas as despesas, encargos, impostos, taxas e consumos decorrentes da utilização do imóvel objeto deste contrato, correspondentes ao período em que o mesmo estiver na sua posse, ainda que se vençam em data posterior a esse período. Após a tomada de posse do imóvel pela Parte Compradora, será esta a responsável pelo pagamento de todas as despesas, encargos, impostos, taxas e consumos.`,

    third: `É da inteira responsabilidade da Parte Vendedora a execução das diligências relativas à obtenção dos documentos legalmente ou convencionalmente necessários à outorga do Contrato Definitivo de Compra e Venda do imóvel prometido junto das entidades competentes, nomeadamente Conservatória do Registo Predial, Finanças, DGPC, Bancos e Câmara Municipal, entre outras, bem como eventuais uniformizações entre tais documentos que se mostrem necessárias à outorga do Contrato Definitivo de Compra e Venda, cancelamento de quaisquer hipotecas, penhoras ou outros ónus registados sobre o imóvel, devendo suportar os respectivos custos e despesas.`,

    fourth: `A Parte Vendedora obriga-se a entregar à Parte Compradora, no dia da celebração do Contrato Definitivo de Compra e Venda prometido, uma Declaração da Administração do Condomínio, nos termos e para os efeitos do disposto no artigo 1424.º-A do Código Civil, caso o imóvel prometido esteja inserido em prédio com condomínio organizado.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [expensesText],
  ([newExpensesText]) => {
    // Emit para o texto completo das despesas
    emit("on-auto-handle-step", {
      name: "expenses",
      key: "expenses",
      html: `${newExpensesText.first} ${newExpensesText.second} ${newExpensesText.third} ${newExpensesText.fourth}`,
    });
  },
  { immediate: true }
);
</script>
