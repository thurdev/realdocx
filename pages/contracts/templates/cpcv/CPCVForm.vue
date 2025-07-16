<template>
  <StepObjects
    v-if="currentStep === 0"
    :contacts="contacts"
    @on-select-seller="handleSelectSeller"
    @on-select-buyer="handleSelectBuyer"
    @on-refresh-contacts="handleRefreshContacts"
  />
  <StepProperties
    v-if="currentStep === 1"
    :properties="properties"
    @on-select-property="handleSelectProperty"
    @on-refresh-properties="handleRefreshProperties"
  />
  <StepObjecto v-if="currentStep === 2" />
  <StepOnus
    v-if="currentStep === 3"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepBankFinancing
    v-if="currentStep === 4"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepPriceAndConditions
    v-if="currentStep === 5"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepDeadlines
    v-if="currentStep === 6"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepExpenses
    v-if="currentStep === 7"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepTradition
    v-if="currentStep === 8"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepPreference
    v-if="currentStep === 9"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepNonAcompliance
    v-if="currentStep === 10"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepNotifications
    v-if="currentStep === 11"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepChanges
    v-if="currentStep === 12"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepRGPD
    v-if="currentStep === 13"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepMoneyLaundering
    v-if="currentStep === 14"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepDeclarations
    v-if="currentStep === 15"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepLaw
    v-if="currentStep === 16"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <StepRecognition
    v-if="currentStep === 17"
    @on-auto-handle-step="handleAutoHandleStep"
  />
  <!--<StepExtraClause
    v-if="currentStep === 18"
    @on-select-clauses="handleSelectClause"
  />
  <template v-for="(clause, index) in extraClauses" :key="index">
    <component
      v-if="currentStep === 19 + index"
      :is="clause.component"
      :clause="clause"
      @on-extra-clause-value="handleExtraClauseValue"
    />
  </template>-->
  <StepReview
    v-if="isLastStep"
    :data="data"
    @onHTMLGenerated="handleHTMLGenerated"
  />
</template>

<script setup lang="ts">
import type { Contact } from "~/pages/contacts/_contacts";
import type { Property } from "~/pages/properties/_property";
import type { ContractTemplate } from "../_templates";

import StepObjects from "./StepObjects.vue";
import StepProperties from "./StepProperties.vue";
import StepPriceAndConditions from "./StepPriceAndConditions.vue";
import StepDeadlines from "./StepDeadlines.vue";
import StepExpenses from "./StepExpenses.vue";
import StepTradition from "./StepTradition.vue";
import StepNotifications from "./StepNotifications.vue";
import StepPreference from "./StepPreference.vue";
import StepMoneyLaundering from "./StepMoneyLaundering.vue";
import StepDeclarations from "./StepDeclarations.vue";
import StepLaw from "./StepLaw.vue";
import StepRecognition from "./StepRecognition.vue";
import StepExtraClause from "./StepExtraClause.vue";
import StepReview from "./StepReview.vue";
import StepObjecto from "./StepObjecto.vue";
import StepOnus from "./StepOnus.vue";
import StepBankFinancing from "./StepBankFinancing.vue";
import StepNonAcompliance from "./StepNonAcompliance.vue";
import StepRGPD from "./StepRGPD.vue";
import StepChanges from "./StepChanges.vue";

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
  onSelectProperty: [Partial<Property>];
  onSelectClauses: [Clause[]];
  onExtraClauseValue: [any];
  onHTMLGenerated: [string];
  onAutoHandleStep: [{ name: string; key: string; html: string }];
  data: {
    selectedSeller: Contact[];
    selectedBuyer: Contact[];
    selectedProperty?: Partial<Property>;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
  };
}>();

const props = defineProps<{
  currentStep: number;
  extraClauses: Clause[];
  isLastStep: boolean;
  data: {
    selectedSeller: Contact[];
    selectedBuyer: Contact[];
    selectedProperty: Partial<Property>;
    selectedClauses: Clause[];
    selectedTemplate: ContractTemplate;
    autoHandleSteps: { name: string; key: string; html: string }[];
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
  emits("onSelectProperty", property as Partial<Property>);
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

const handleAutoHandleStep = (step: {
  name: string;
  key: string;
  html: string;
}) => {
  emits("onAutoHandleStep", step);
};

const handleRefreshContacts = () => {
  $fetch<Contact[]>("/api/contacts").then((newContacts) => {
    contacts.value = newContacts;
  });
};

const handleRefreshProperties = () => {
  $fetch<Property[]>("/api/properties").then((newProperties) => {
    properties.value = newProperties;
  });
};
</script>
