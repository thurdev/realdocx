<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Reconhecimento de Assinaturas</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox
            id="mutualRecognition"
            v-model="recognition.mutualRecognition"
          />
          <label for="mutualRecognition" class="text-sm"
            >Reconhecimento mútuo das assinaturas</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="noNotary" v-model="recognition.noNotary" />
          <label for="noNotary" class="text-sm"
            >Dispensa do reconhecimento notarial</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const recognition = ref({
  mutualRecognition: true,
  noNotary: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  recognition,
  (newRecognition) => {
    const recognitionText = Object.entries(newRecognition)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "mutualRecognition":
            return "reconhecem entre si as assinaturas apostas no presente Contrato";
          case "noNotary":
            return "prescindindo do reconhecimento notarial";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhum reconhecimento selecionado, não emitimos o evento
    if (!recognitionText) {
      emit("on-extra-clause-value", {
        key: "recognition",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "recognition",
      value: recognitionText,
      html: `<h2>15.º Cláusula (Reconhecimentos)</h2><p>Os Outorgantes ${recognitionText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
