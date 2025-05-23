<template>
  <div
    class="flex flex-col flex-1 gap-4 w-full transition-all duration-500 ease-in-out relative"
    :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
  >
    <div class="text-xl font-semibold mb-4 transition-opacity duration-500">
      {{ $t("contracts.review") }}
    </div>
    <div
      class="preview-section w-full bg-white rounded-lg p-6 transition-all duration-500 relative overflow-hidden"
      ref="cpcvContainer"
      v-html="renderHtml()"
    ></div>
    <div
      class="absolute left-0 right-0 bottom-0 h-64 flex items-end justify-center pointer-events-none z-1"
      style="
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          #fff 80%
        );
      "
    >
      <span
        class="text-[#444] text-[1.1rem] font-medium px-6 pt-3 pb-2 mb-2 text-blue-500"
      >
        Guarde o Contrato para visualizar/editar.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contacts";
import type { Property } from "~/types/properties";
import type { Clause } from "./CPCVForm.vue";
import type { ContractTemplate } from "../_templates";
import { ref, onMounted } from "vue";
import { generateContractHtml, getFirstPageHtml } from "./review";

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

const renderHtml = () => {
  const html = generateContractHtml(props.data);
  emits("onHTMLGenerated", html);
  return getFirstPageHtml(html);
};
</script>
