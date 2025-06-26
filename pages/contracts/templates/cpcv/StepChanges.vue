<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Condições para Alterações</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="writtenDocument" v-model="changes.writtenDocument" />
          <label for="writtenDocument" class="text-sm">Documento escrito</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="allSignatures" v-model="changes.allSignatures" />
          <label for="allSignatures" class="text-sm"
            >Assinado por todos os Outorgantes</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const changes = ref({
  writtenDocument: true,
  allSignatures: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  changes,
  (newChanges) => {
    const changesText = Object.entries(newChanges)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "writtenDocument":
            return "documento escrito";
          case "allSignatures":
            return "assinado por todos os Outorgantes";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" e ");

    // Se não houver nenhuma condição selecionada, não emitimos o evento
    if (!changesText) {
      emit("on-extra-clause-value", {
        key: "changes",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "changes",
      value: changesText,
      html: `<h2>10.º Cláusula (Alterações)</h2><p>O presente Contrato Promessa só poderá ser alterado mediante ${changesText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
