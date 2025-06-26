<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Preço</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="price" v-model="prices.price" />
          <label for="price" class="text-sm">Preço total</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="deposit" v-model="prices.deposit" />
          <label for="deposit" class="text-sm">Sinal</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="balance" v-model="prices.balance" />
          <label for="balance" class="text-sm">Saldo</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const prices = ref({
  price: true,
  deposit: true,
  balance: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  prices,
  (newPrices) => {
    const priceText = Object.entries(newPrices)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "price":
            return "preço total";
          case "deposit":
            return "sinal";
          case "balance":
            return "saldo";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhum preço selecionado, não emitimos o evento
    if (!priceText) {
      emit("on-extra-clause-value", {
        key: "prices",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "prices",
      value: JSON.stringify({
        prices: priceText,
      }),
      html: `<h2>4.º Cláusula (Preço e Forma de Pagamento)</h2>
        <p>O preço da venda é de ${priceText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
