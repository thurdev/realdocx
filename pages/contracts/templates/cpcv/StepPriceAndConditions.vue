<template>
  <div class="space-y-6">
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
      <!-- Preço Total -->
      <div>
        <Label for="priceTotal">Preço total</Label>
        <NumberField
          id="priceTotal"
          v-model="priceTotal"
          :default-value="0"
          :format-options="{ style: 'currency', currency: 'EUR' }"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <!-- Sinal e princípio de pagamento -->
      <div>
        <Label for="sinal">Sinal e princípio de pagamento</Label>
        <NumberField
          id="sinal"
          v-model="sinal"
          :default-value="5000"
          :format-options="{ style: 'currency', currency: 'EUR' }"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <!-- Reforço de sinal (opcional) -->
      <div>
        <Label for="reforco">Reforço de sinal (opcional)</Label>
        <NumberField
          id="reforco"
          v-model="reforco"
          :default-value="0"
          :format-options="{ style: 'currency', currency: 'EUR' }"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
      </div>

      <!-- Valor remanescente (calculado) -->
      <div>
        <Label for="remanescente">Valor remanescente</Label>
        <div
          class="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-muted-foreground opacity-50"
        >
          {{
            new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(calculatedRemanescente)
          }}
        </div>
      </div>
    </div>

    <!-- Preview do HTML gerado -->
    <div v-if="paymentTextHtml" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto de pagamento:</h4>
      <div class="text-sm leading-relaxed" v-html="paymentTextHtml"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
import { cn } from "@/lib/utils";
import extenso from "extenso";

const priceTotal = ref(279900);
const sinal = ref(5000);
const reforco = ref(0);

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Computed para calcular o remanescente
const calculatedRemanescente = computed(() => {
  return priceTotal.value - sinal.value - reforco.value;
});

// Computed para gerar o HTML do texto de pagamento
const paymentTextHtml = computed(() => {
  const hasReforco = reforco.value > 0;

  let html = "";

  // Item a) - Sinal (sempre presente)
  html += `<li style='display: flex; align-items: flex-start'>
        <div style='padding-right: 1rem'>a.</div>
        <div>
          a quantia de <b>€${sinal.value.toLocaleString("pt-PT")} (${extenso(
    sinal.value,
    {
      mode: "currency",
      currency: { type: "EUR" },
      locale: "pt",
    }
  )})</b>, a título de sinal e princípio de pagamento, com a assinatura do presente Contrato, a ser realizada mediante a seguinte forma de pagamento, sendo dada quitação após boa cobrança:
        </div>
      </li>`;

  if (hasReforco) {
    // Item b) - Reforço
    html += `<li style='display: flex; align-items: flex-start'>
        <div style='padding-right: 1rem'>b.</div>
        <div>
          a quantia de <b>€${reforco.value.toLocaleString("pt-PT")} (${extenso(
      reforco.value,
      {
        mode: "currency",
        currency: { type: "EUR" },
        locale: "pt",
      }
    )})</b>, como reforço de sinal e princípio de pagamento no 16º ( décimo sexto) dia a contar da assinatura do presente Contrato
        </div>
      </li>`;

    // Item c) - Remanescente
    html += `<li style='display: flex; align-items: flex-start'>
        <div style='padding-right: 1rem'>c.</div>
        <div>
          a parte remanescente do valor da venda, ou seja, a quantia de <b>€${calculatedRemanescente.value.toLocaleString(
            "pt-PT"
          )} (${extenso(calculatedRemanescente.value, {
      mode: "currency",
      currency: { type: "EUR" },
      locale: "pt",
    })})</b>, será paga pela Parte Compradora à Parte Vendedora, através de cheque visado ou cheque bancário, no ato da assinatura do Contrato Definitivo de Compra e Venda.
        </div>
      </li>`;
  } else {
    // Item b) - Remanescente (quando não há reforço)
    html += `<li style='display: flex; align-items: flex-start'>
        <div style='padding-right: 1rem'>b.</div>
        <div>
          a parte remanescente do valor da venda, ou seja, a quantia de <b>€${calculatedRemanescente.value.toLocaleString(
            "pt-PT"
          )} (${extenso(calculatedRemanescente.value, {
      mode: "currency",
      currency: { type: "EUR" },
      locale: "pt",
    })})</b>, será paga pela Parte Compradora à Parte Vendedora, através de cheque visado ou cheque bancário, no ato da assinatura do Contrato Definitivo de Compra e Venda.
        </div>
      </li>`;
  }

  return html;
});

// Watch para atualizar o remanescente calculado
watch(
  [priceTotal, sinal, reforco],
  () => {
    // O calculatedRemanescente é reativo, não precisa de watcher separado
  },
  { immediate: true }
);

watch(
  [priceTotal, sinal, reforco, paymentTextHtml],
  ([newPriceTotal, newSinal, newReforco, newPaymentTextHtml]) => {
    // Emit para o preço total (mantém os existentes)
    emit("on-auto-handle-step", {
      name: "property-price",
      key: "property-price",
      html: new Intl.NumberFormat("pt-PT", {
        style: "currency",
        currency: "EUR",
      }).format(newPriceTotal),
    });

    emit("on-auto-handle-step", {
      name: "property-price-formatted",
      key: "property-price-formatted",
      html: extenso(newPriceTotal, {
        mode: "currency",
        currency: { type: "EUR" },
        locale: "pt",
      }),
    });

    // Emit para o texto de pagamento
    emit("on-auto-handle-step", {
      name: "property-price-sinal",
      key: "property-price-sinal",
      html: newPaymentTextHtml,
    });
  },
  { immediate: true }
);
</script>
