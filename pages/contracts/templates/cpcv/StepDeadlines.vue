<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Prazos</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="signature" v-model="deadlines.signature" />
          <label for="signature" class="text-sm"
            >Assinatura do contrato definitivo</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="payment" v-model="deadlines.payment" />
          <label for="payment" class="text-sm">Pagamento do saldo</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="possession" v-model="deadlines.possession" />
          <label for="possession" class="text-sm">Entrega da posse</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const deadlines = ref({
  signature: true,
  payment: true,
  possession: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  deadlines,
  (newDeadlines) => {
    const deadlineText = Object.entries(newDeadlines)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "signature":
            return "assinatura do contrato definitivo";
          case "payment":
            return "pagamento do saldo";
          case "possession":
            return "entrega da posse";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhum prazo selecionado, não emitimos o evento
    if (!deadlineText) {
      emit("on-extra-clause-value", {
        key: "deadlines",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "deadlines",
      value: JSON.stringify({
        deadlines: deadlineText,
      }),
      html: `<h2>3.º Cláusula (Prazos)</h2>
        <p>Os prazos para ${deadlineText} serão acordados entre as partes.</p>`,
    });
  },
  { immediate: true }
);
</script>
