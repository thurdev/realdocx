<template>
  <div class="space-y-6">
    <!-- Seção de Financiamento Bancário -->
    <div class="space-y-4">
      <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
        <!-- Dias para financiamento -->
        <div>
          <Label for="financingDays">Dias para financiamento</Label>
          <NumberField
            id="financingDays"
            v-model="financingDays"
            :default-value="15"
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

        <!-- Dias para prova -->
        <div>
          <Label for="proofDays">Dias para prova</Label>
          <NumberField
            id="proofDays"
            v-model="proofDays"
            :default-value="8"
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

        <!-- Dias para devolução -->
        <div>
          <Label for="refundDays">Dias para devolução</Label>
          <NumberField
            id="refundDays"
            v-model="refundDays"
            :default-value="5"
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
    <div v-if="financingText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto de financiamento:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ financingText.first }}</p>
        <p><strong>2.</strong> {{ financingText.second }}</p>
        <p><strong>3.</strong> {{ financingText.third }}</p>
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

const financingDays = ref(15);
const proofDays = ref(8);
const refundDays = ref(5);

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Função para corrigir problemas gramaticais com números
const getCorrectedNumberText = (
  num: number,
  singular: string,
  plural: string
): string => {
  const words = extenso(num, {
    mode: "number",
    locale: "pt",
    number: { gender: "m" },
  });

  const wordForm = num === 1 ? singular : plural;
  return words.charAt(0).toUpperCase() + words.slice(1) + ` ${wordForm}`;
};

// Computed para gerar o texto do financiamento
const financingText = computed(() => {
  const financingDaysText = getCorrectedNumberText(
    financingDays.value,
    "dia",
    "dias"
  );

  const proofDaysText = getCorrectedNumberText(proofDays.value, "dia", "dias");

  const refundDaysText = getCorrectedNumberText(
    refundDays.value,
    "dia",
    "dias"
  );

  return {
    first: `Considerando que a Parte Compradora necessita de recorrer a financiamento bancário para aquisição do imóvel prometido, acordam os Outorgantes que, caso o financiamento não seja concedido por insuficiência do valor de avaliação do imóvel e/ou não obtenham aprovação do financiamento bancário necessário para a compra do mesmo, no prazo máximo de ${financingDays.value} (${financingDaysText}) seguidos a contar da assinatura do presente Contrato, é reconhecido à Parte Compradora o direito de resolver o presente Contrato, não havendo lugar a qualquer indemnização ou compensação adicional.`,

    second: `Para os efeitos do número anterior, a Parte Compradora deve fazer prova, perante a Parte Vendedora, da insuficiência do valor da avaliação e/ou recusa do financiamento, mediante documento bancário, no prazo máximo de ${proofDays.value} (${proofDaysText}) a contar do seu conhecimento.`,

    third: `A Parte Vendedora obriga-se a proceder à devolução, em singelo, de todos os valores recebidos a título de sinal e princípio de pagamento, no prazo máximo de ${refundDays.value} (${refundDaysText}) a contar da data do recebimento da comunicação para o efeito. No mesmo prazo, deve a Mediadora Imobiliária proceder à devolução do valor recebido a título de reserva, sinal e princípio de pagamento.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [financingText, financingDays, proofDays, refundDays],
  ([newFinancingText, newFinancingDays, newProofDays, newRefundDays]) => {
    // Emit para os dias do financiamento
    emit("on-auto-handle-step", {
      name: "bank-financing-first",
      key: "bank-financing-first",
      html: `${newFinancingDays} (${getCorrectedNumberText(
        newFinancingDays,
        "dia",
        "dias"
      )})`,
    });

    emit("on-auto-handle-step", {
      name: "bank-financing-second",
      key: "bank-financing-second",
      html: `${newProofDays} (${getCorrectedNumberText(
        newProofDays,
        "dia",
        "dias"
      )})`,
    });

    emit("on-auto-handle-step", {
      name: "bank-financing-third",
      key: "bank-financing-third",
      html: `${newRefundDays} (${getCorrectedNumberText(
        newRefundDays,
        "dia",
        "dias"
      )})`,
    });
  },
  { immediate: true }
);
</script>
