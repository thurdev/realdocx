<template>
  <StepObjects
    v-if="currentStep === 0"
    :contacts="contacts"
    @on-select-seller="handleSelectSeller"
    @on-select-buyer="handleSelectBuyer"
  />
  <StepProperties
    v-if="currentStep === 1"
    :properties="properties"
    @on-select-property="handleSelectProperty"
  />
  <StepPriceAndConditions
    v-if="currentStep === 3"
    @on-select-clauses="handleSelectClause"
  />
  <StepExtraClause
    v-if="currentStep === 13"
    @on-select-clauses="handleSelectClause"
  />
  <template v-for="(clause, index) in extraClauses" :key="index">
    <component
      v-if="currentStep === 3 + index"
      :is="clause.component"
      :clause="clause"
      @on-extra-clause-value="handleExtraClauseValue"
    />
  </template>
  <StepReview
    v-if="isLastStep"
    :data="data"
    @onHTMLGenerated="handleHTMLGenerated"
  />
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contacts";
import type { Property } from "~/types/properties";
import type { ContractTemplate } from "../_templates";

import StepObjects from "./StepObjects.vue";
import StepProperties from "./StepProperties.vue";
import StepPriceAndConditions from "./StepPriceAndConditions.vue";
import StepExtraClause from "./StepExtraClause.vue";
import StepReview from "./StepReview.vue";

export interface Clause {
  name: string;
  description: string;
  component: Component;
  html: string;
  key?: string;
  value?: any;
  order: number;
}

const emits = defineEmits<{
  onSelectSeller: [Contact[]];
  onSelectBuyer: [Contact[]];
  onSelectProperty: [Property];
  onSelectClauses: [Clause[]];
  onExtraClauseValue: [any];
  onHTMLGenerated: [string];
  data: {
    selectedSeller: Contact[];
    selectedBuyer: Contact[];
    selectedProperty?: Property;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
  };
}>();

defineProps<{
  currentStep: number;
  extraClauses: Clause[];
  isLastStep: boolean;
  data: {
    selectedSeller: Contact[];
    selectedBuyer: Contact[];
    selectedProperty: Property;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
  };
}>();

const contacts = ref<Contact[]>([]);
const properties = ref<Property[]>([]);

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
  properties.value = await $fetch<Property[]>("/api/properties");
});

const handleSelectSeller = (contacts: Contact[]) => {
  emits("onSelectSeller", contacts);
};

const handleSelectBuyer = (contacts: Contact[]) => {
  emits("onSelectBuyer", contacts);
};

const handleSelectProperty = (id: number) => {
  const property = properties.value.find((p) => p.id === id);
  emits("onSelectProperty", property as Property);
};

const handleSelectClause = (clauses: Clause[]) => {
  emits("onSelectClauses", clauses);
};

const handleExtraClauseValue = (value: any) => {
  emits("onExtraClauseValue", value);
};

const handleHTMLGenerated = (htmlContent: string) => {
  emits("onHTMLGenerated", htmlContent);
};
</script>
