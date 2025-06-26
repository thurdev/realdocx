<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Despesas do Comprador</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="notary" v-model="buyerExpenses.notary" />
          <label for="notary" class="text-sm">Despesas notariais</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="registry" v-model="buyerExpenses.registry" />
          <label for="registry" class="text-sm">Despesas registrais</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="tax" v-model="buyerExpenses.tax" />
          <label for="tax" class="text-sm">Despesas tributárias</label>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <Label>Despesas do Vendedor</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="expenses" v-model="sellerExpenses.expenses" />
          <label for="expenses" class="text-sm">Despesas de utilização</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="charges" v-model="sellerExpenses.charges" />
          <label for="charges" class="text-sm">Encargos</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="taxes" v-model="sellerExpenses.taxes" />
          <label for="taxes" class="text-sm">Impostos</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="rates" v-model="sellerExpenses.rates" />
          <label for="rates" class="text-sm">Taxas</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="consumption" v-model="sellerExpenses.consumption" />
          <label for="consumption" class="text-sm">Consumos</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const buyerExpenses = ref({
  notary: true,
  registry: true,
  tax: true,
});

const sellerExpenses = ref({
  expenses: true,
  charges: true,
  taxes: true,
  rates: true,
  consumption: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  [buyerExpenses, sellerExpenses],
  ([newBuyerExpenses, newSellerExpenses]) => {
    const buyerText = Object.entries(newBuyerExpenses)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "notary":
            return "despesas notariais";
          case "registry":
            return "despesas registrais";
          case "tax":
            return "despesas tributárias";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    const sellerText = Object.entries(newSellerExpenses)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "expenses":
            return "despesas de utilização";
          case "charges":
            return "encargos";
          case "taxes":
            return "impostos";
          case "rates":
            return "taxas";
          case "consumption":
            return "consumos";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhuma despesa selecionada, não emitimos o evento
    if (!buyerText && !sellerText) {
      emit("on-extra-clause-value", {
        key: "expenses",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "expenses",
      value: JSON.stringify({
        buyer: buyerText,
        seller: sellerText,
      }),
      html: `<h2>5.º Cláusula (Despesas e Encargos)</h2>
        ${
          buyerText
            ? `<p>Correm por conta da Parte Compradora o pagamento de ${buyerText} decorrentes do presente Contrato Promessa e da celebração do Contrato Definitivo de Compra e Venda.</p>`
            : ""
        }
        ${
          sellerText
            ? `<p>Correm por conta da Parte Vendedora ${sellerText} decorrentes da utilização do imóvel objeto deste contrato até à transmissão da posse.</p>`
            : ""
        }`,
    });
  },
  { immediate: true }
);
</script>
