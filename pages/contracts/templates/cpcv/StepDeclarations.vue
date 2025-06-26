<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Declarações do Vendedor</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="noDisputes" v-model="declarations.noDisputes" />
          <label for="noDisputes" class="text-sm"
            >Não existem litígios sobre o imóvel</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="noCharges" v-model="declarations.noCharges" />
          <label for="noCharges" class="text-sm"
            >Não existem ónus sobre o imóvel</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="noAffect" v-model="declarations.noAffect" />
          <label for="noAffect" class="text-sm"
            >Nenhum litígio ou ónus pode afetar o presente Contrato</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const declarations = ref({
  noDisputes: true,
  noCharges: true,
  noAffect: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  declarations,
  (newDeclarations) => {
    const declarationsText = Object.entries(newDeclarations)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "noDisputes":
            return "não existem litígios sobre o imóvel";
          case "noCharges":
            return "não existem ónus sobre o imóvel";
          case "noAffect":
            return "nenhum litígio ou ónus pode afetar o presente Contrato";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhuma declaração selecionada, não emitimos o evento
    if (!declarationsText) {
      emit("on-extra-clause-value", {
        key: "declarations",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "declarations",
      value: declarationsText,
      html: `<h2>13.º Cláusula (Declarações)</h2><p>A Parte Vendedora declara que ${declarationsText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
