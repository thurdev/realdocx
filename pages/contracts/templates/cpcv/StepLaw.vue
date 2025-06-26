<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Lei Aplicável e Foro Competente</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="portugueseLaw" v-model="law.portugueseLaw" />
          <label for="portugueseLaw" class="text-sm">Lei Portuguesa</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox
            id="propertyJurisdiction"
            v-model="law.propertyJurisdiction"
          />
          <label for="propertyJurisdiction" class="text-sm"
            >Tribunal da Comarca do imóvel</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const law = ref({
  portugueseLaw: true,
  propertyJurisdiction: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  law,
  (newLaw) => {
    const lawText = Object.entries(newLaw)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "portugueseLaw":
            return "Lei Portuguesa";
          case "propertyJurisdiction":
            return "Tribunal da Comarca do imóvel";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(". Para resolução de conflitos será competente o ");

    // Se não houver nenhuma lei selecionada, não emitimos o evento
    if (!lawText) {
      emit("on-extra-clause-value", {
        key: "law",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "law",
      value: lawText,
      html: `<h2>14.º Cláusula (Lei aplicável e Foro competente)</h2><p>O presente Contrato é regulado pela ${lawText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
