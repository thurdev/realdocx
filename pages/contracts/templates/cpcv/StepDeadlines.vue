<template>
  <div class="space-y-6">
    <!-- Seção de Prazos -->
    <div class="space-y-4">
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <!-- Dias para contrato definitivo -->
        <div>
          <Label for="contractDays">Dias para contrato definitivo</Label>
          <NumberField
            id="contractDays"
            v-model="contractDays"
            :default-value="90"
            :min="1"
            :max="365"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>

        <!-- Dias de antecedência -->
        <div>
          <Label for="advanceDays">Dias de antecedência</Label>
          <NumberField
            id="advanceDays"
            v-model="advanceDays"
            :default-value="12"
            :min="1"
            :max="365"
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </div>
      </div>
    </div>

    <!-- Preview do texto gerado -->
    <div v-if="deadlinesText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto de prazos:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ deadlinesText.first }}</p>
        <p><strong>2.</strong> {{ deadlinesText.second }}</p>
        <p><strong>3.</strong> {{ deadlinesText.third }}</p>
        <p><strong>4.</strong> {{ deadlinesText.fourth }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import extenso from "extenso";

const contractDays = ref(90);
const advanceDays = ref(12);

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Função para corrigir problemas gramaticais com números
const getCorrectedNumberText = (num: number): string => {
  const words = extenso(num, {
    mode: "number",
    locale: "pt",
    number: { gender: "m" },
  });

  return words.charAt(0).toUpperCase() + words.slice(1);
};

// Computed para gerar o texto dos prazos
const deadlinesText = computed(() => {
  const contractDaysText = getCorrectedNumberText(contractDays.value);
  const advanceDaysText = getCorrectedNumberText(advanceDays.value);

  const contractDayWord = contractDays.value === 1 ? "dia" : "dias";
  const advanceDayWord = advanceDays.value === 1 ? "dia" : "dias";

  return {
    first: `O Contrato Definitivo de Compra e Venda será celebrado em Cartório Notarial ou Balcão Casa Pronta, ou entidade equiparada, a designar pela Parte Compradora no prazo máximo de ${contractDays.value} (${contractDaysText}) ${contractDayWord}, a contar da data da assinatura do presente Contrato Promessa de Compra e Venda e reunidos todos os documentos necessários, podendo o mesmo ser prorrogado mediante acordo de todos os Outorgantes.`,

    second: `Para os efeitos do número anterior, a Parte Compradora compromete-se a comunicar à outra Parte a hora e local da celebração do Contrato Definitivo de Compra e Venda, com a antecedência mínima de ${advanceDays.value} (${advanceDaysText}) ${advanceDayWord} úteis`,

    third: `A Parte Vendedora obterá, com excepção dos documentos de identificação da Parte Compradora e do conhecimento de Imposto do Selo e de IMT - Imposto Municipal sobre Transmissões Onerosas de Imóveis, sempre que o mesmo for exigível, todos os documentos necessários à realização do Contrato Definitivo de Compra e Venda e relativos ao imóvel identificado na Cláusula Primeira.`,

    fourth: `A Parte Vendedora compromete-se a colaborar em todos os actos necessários à celebração do Contrato Definitivo de Compra e Venda.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [deadlinesText, contractDays, advanceDays],
  ([newDeadlinesText, newContractDays, newAdvanceDays]) => {
    const contractDayWord = newContractDays === 1 ? "dia" : "dias";
    const advanceDayWord = newAdvanceDays === 1 ? "dia" : "dias";

    // Emit para os dias do contrato definitivo
    emit("on-auto-handle-step", {
      name: "deadlines-contract",
      key: "deadlines-contract",
      html: `${newContractDays} (${getCorrectedNumberText(
        newContractDays
      )}) ${contractDayWord}`,
    });

    emit("on-auto-handle-step", {
      name: "deadlines-advance",
      key: "deadlines-advance",
      html: `${newAdvanceDays} (${getCorrectedNumberText(
        newAdvanceDays
      )}) ${advanceDayWord}`,
    });
  },
  { immediate: true }
);
</script>
