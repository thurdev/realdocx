<template>
  <div class="space-y-6">
    <!-- Seção de Não Cumprimento -->
    <div class="space-y-4">
      <div class="grid gap-4 grid-cols-1 md:grid-cols-1">
        <!-- Dias para devolução -->
        <div>
          <Label for="refundDays">Dias para devolução do sinal</Label>
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
    <div v-if="nonAcomplianceText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed">
        <p>{{ nonAcomplianceText }}</p>
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

const refundDays = ref(5);

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

// Computed para gerar o texto de não cumprimento
const nonAcomplianceText = computed(() => {
  const refundDaysText = getCorrectedNumberText(refundDays.value);
  const refundDayWord = refundDays.value === 1 ? "dia" : "dias";

  return `Acordam os Outorgantes que, caso qualquer entidade pública ou privada exerça o direito legal de preferência, ou qualquer tipo de direito de preferência que a lei lhes confira sobre a compra e venda a realizar constante no presente Contrato Promessa, a Parte Vendedora devolve à Parte Compradora, no prazo de ${refundDays.value} (${refundDaysText}) ${refundDayWord} contados da data a partir da qual tomou conhecimento da intenção de preferir, em singelo, a quantia recebida a título de sinal e princípio de pagamento, ficando o presente Contrato automaticamente resolvido, não havendo lugar a qualquer indemnização ou compensação. No mesmo prazo, deve a Mediadora Imobiliária proceder à devolução do valor recebido a título de reserva, sinal e princípio de pagamento.`;
});

// Watch para emitir o texto gerado
watch(
  [nonAcomplianceText, refundDays],
  ([newNonAcomplianceText, newRefundDays]) => {
    // Emit para os dias de devolução
    emit("on-auto-handle-step", {
      name: "non-acompliance-days",
      key: "non-acompliance-days",
      html: `${newRefundDays} (${getCorrectedNumberText(newRefundDays)}) ${
        newRefundDays === 1 ? "dia" : "dias"
      }`,
    });
  },
  { immediate: true }
);
</script>
