<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Declaração de Branqueamento de Capitais</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox
            id="noIllegalActivity"
            v-model="declaration.noIllegalActivity"
          />
          <label for="noIllegalActivity" class="text-sm"
            >Os montantes entregues não provêm de actividade ilícita</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const declaration = ref({
  noIllegalActivity: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  declaration,
  (newDeclaration) => {
    const declarationText = Object.entries(newDeclaration)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "noIllegalActivity":
            return "os montantes entregues não provêm de actividade ilícita";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhuma declaração selecionada, não emitimos o evento
    if (!declarationText) {
      emit("on-extra-clause-value", {
        key: "moneyLaundering",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "moneyLaundering",
      value: declarationText,
      html: `<h2>12.º Cláusula (Branqueamento de Capitais)</h2><p>A Parte Compradora declara que ${declarationText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
