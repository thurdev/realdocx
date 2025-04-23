<template>
  <div class="flex flex-col flex-1 gap-4">
    REVEJA O CONTRACTO:
    <div
      class="preview-section"
      ref="cpcvContainer"
      v-once
      v-html="generateContractHtml()"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contacts";
import type { Property } from "~/types/properties";
import type { Clause } from "./CPCVForm.vue";
import type { ContractTemplate } from "../_templates";

const props = defineProps<{
  data: {
    selectedSeller: Contact;
    selectedBuyer: Contact;
    selectedProperty: Property;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
  };
}>();

watch(
  () => props.data,
  (newValue) => {
    console.log(props.data);
  },
  { immediate: true }
);

const generateContractHtml = (): string => {
  if (
    props.data.selectedSeller === undefined ||
    props.data.selectedBuyer === undefined ||
    props.data.selectedProperty === undefined ||
    props.data.selectedTemplate === undefined
  )
    return "";

  let html = props.data.selectedTemplate.html;

  // Substituir placeholders
  const data: Record<string, any> = {
    seller: props.data.selectedSeller,
    buyer: props.data.selectedBuyer,
    landlord: props.data.selectedBuyer,
    tenant: props.data.selectedSeller,
    property: props.data.selectedProperty,
  };

  // Se for contrato de arrendamento, inverte as partes
  if (props.data.selectedTemplate.type === "RENT") {
    data.landlord = props.data.selectedSeller;
    data.tenant = props.data.selectedBuyer;
  }

  // Substituir todos os placeholders {{variavel}} pelos valores reais
  html = html.replace(/\{\{([^}]+)\}\}/g, (match: string, key: string) => {
    const keys = key.trim().split(".");
    let value: any = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value?.toString() || "";
  });

  // Extra clauses
  props.data.selectedClauses
    .sort((a, b) => a.order - b.order)
    .forEach((clause) => {
      html += `<div>${clause.html}</div>`;
      const regex = new RegExp(`{{${clause.key}}}`, "g");
      console.log(clause.value, clause.key);
      html = html.replace(regex, clause.value);
    });

  return html;
};
</script>
