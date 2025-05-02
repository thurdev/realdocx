<template>
  <div
    class="flex flex-col flex-1 gap-4 w-full transition-all duration-500 ease-in-out"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
  >
    <div class="text-xl font-semibold mb-4 transition-opacity duration-500">
      {{ $t("contracts.review") }}
    </div>
    <div
      class="preview-section w-full bg-white rounded-lg shadow-sm p-6 transition-all duration-500"
      ref="cpcvContainer"
      v-html="generateContractHtml()"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contacts";
import type { Property } from "~/types/properties";
import type { Clause } from "./CPCVForm.vue";
import type { ContractTemplate } from "../_templates";
import { ref, onMounted } from "vue";

const isVisible = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
});

const emits = defineEmits<{
  onHTMLGenerated: [string];
}>();

const props = defineProps<{
  data: {
    selectedSeller: Contact[];
    selectedBuyer: Contact[];
    selectedProperty: Property;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
  };
}>();

watch(
  () => props.data,
  (newValue) => {
    //console.log(props.data);
  },
  { immediate: true }
);

const generateContractHtml = (): string => {
  if (
    props.data.selectedBuyer.length === 0 ||
    props.data.selectedSeller.length === 0 ||
    props.data.selectedProperty === undefined ||
    props.data.selectedTemplate === undefined
  ) {
    return "";
  }

  let html = props.data.selectedTemplate.html;

  let sellersHtml = "";

  // First we loop thorugh the sellers
  for (const [index, seller] of props.data.selectedSeller.entries()) {
    let sellerHtml = `${index + 1}. `;
    sellerHtml += props.data.selectedTemplate.objectsHtml.seller;
    // Replace the placeholders with the actual values
    sellerHtml = sellerHtml.replace("{{seller.name}}", seller.name);
    sellerHtml = sellerHtml.replace("{{seller.vat}}", seller.vat);
    sellerHtml = sellerHtml.replace(
      "{{seller.maritalStatus}}",
      seller.maritalStatus
    );
    sellerHtml = sellerHtml.replace("{{seller.address}}", seller.address);
    // Add the seller html to the sellers html
    sellersHtml += sellerHtml;
  }
  sellersHtml += "</br>";
  // Replace the {{sellers}} placeholder with the sellers html
  html = html.replace("{{sellers}}", sellersHtml);

  // Do the same for the buyers
  let buyersHtml = "";
  for (const [index, buyer] of props.data.selectedBuyer.entries()) {
    let buyerHtml = `${index + 1}. `;
    buyerHtml += props.data.selectedTemplate.objectsHtml.buyer;
    buyerHtml = buyerHtml.replace("{{buyer.name}}", buyer.name);
    buyerHtml = buyerHtml.replace("{{buyer.vat}}", buyer.vat);
    buyerHtml = buyerHtml.replace(
      "{{buyer.maritalStatus}}",
      buyer.maritalStatus
    );
    buyerHtml = buyerHtml.replace("{{buyer.address}}", buyer.address);
    buyersHtml += buyerHtml + "</br>";
  }

  // Replace the {{buyers}} placeholder with the buyers html
  html = html.replace("{{buyers}}", buyersHtml);

  console.log(props.data.selectedProperty);

  // Replace the property placeholder's with the property values
  html = html.replace(
    "{{property.fraction}}",
    props.data.selectedProperty.fraction
  );
  html = html.replace("{{property.floor}}", props.data.selectedProperty.floor);
  html = html.replace(
    "{{property.destination}}",
    props.data.selectedProperty.destination
  );
  html = html.replace(
    "{{property.address}}",
    props.data.selectedProperty.address
  );

  // Substituir placeholders
  /*const data: Record<string, any> = {
    seller: props.data.selectedSeller,
    buyer: props.data.selectedBuyer,
    landlord: props.data.selectedBuyer,
    tenant: props.data.selectedSeller,
    property: props.data.selectedProperty,
  };*/

  // Substituir todos os placeholders {{variavel}} pelos valores reais
  /*html = html.replace(/\{\{([^}]+)\}\}/g, (match: string, key: string) => {
    const keys = key.trim().split(".");
    let value: any = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value?.toString() || "";
  });*/

  // Extra clauses
  props.data.selectedClauses
    .sort((a, b) => a.order - b.order)
    .forEach((clause) => {
      html += `<div>${clause.html}</div>`;
      const regex = new RegExp(`{{${clause.key}}}`, "g");
      console.log(clause.value, clause.key);
      html = html.replace(regex, clause.value);
    });

  emits("onHTMLGenerated", html);
  return html;
};
</script>
