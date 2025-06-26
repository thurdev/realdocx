<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Cláusula de Intervenção</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox id="intervention" v-model="intervention.intervention" />
          <label for="intervention" class="text-sm"
            >Cláusula de intervenção</label
          >
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="notary" v-model="intervention.notary" />
          <label for="notary" class="text-sm">Notário</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="registry" v-model="intervention.registry" />
          <label for="registry" class="text-sm">Registrador</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const intervention = ref({
  intervention: true,
  notary: true,
  registry: true,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  intervention,
  (newIntervention) => {
    const interventionText = Object.entries(newIntervention)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "intervention":
            return "cláusula de intervenção";
          case "notary":
            return "notário";
          case "registry":
            return "registrador";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(", ");

    // Se não houver nenhuma intervenção selecionada, não emitimos o evento
    if (!interventionText) {
      emit("on-extra-clause-value", {
        key: "intervention",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "intervention",
      value: JSON.stringify({
        intervention: interventionText,
      }),
      html: `<h2>2.º Cláusula (Intervenção)</h2>
        <p>As partes concordam com a intervenção do ${interventionText} no presente contrato.</p>`,
    });
  },
  { immediate: true }
);
</script>
