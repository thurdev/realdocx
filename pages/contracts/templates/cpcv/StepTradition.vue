<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Condições para Tradição do Imóvel</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="fullPayment" v-model="conditions.fullPayment" />
          <label for="fullPayment" class="text-sm"
            >Liquidação total do preço</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="definitiveContract"
            v-model="conditions.definitiveContract"
          />
          <label for="definitiveContract" class="text-sm"
            >Realização do Contrato Definitivo de Compra e Venda</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const conditions = ref({
  fullPayment: true,
  definitiveContract: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  conditions,
  (newConditions) => {
    const conditionsText = Object.entries(newConditions)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "fullPayment":
            return "liquidação total do preço";
          case "definitiveContract":
            return "realização do Contrato Definitivo de Compra e Venda";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" e com a ");

    // Se não houver nenhuma condição selecionada, não emitimos o evento
    if (!conditionsText) {
      emit("on-extra-clause-value", {
        key: "tradition",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "tradition",
      value: conditionsText,
      html: `<h2>6.º Cláusula (Tradição)</h2><p>À Parte Compradora só será concedida plena posse, fruição e gozo do imóvel prometido com a ${conditionsText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
