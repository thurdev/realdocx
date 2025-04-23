<template>
  <Step01Objects
    v-if="currentStep === 0"
    :contacts="contacts"
    @on-select-seller="handleSelectSeller"
    @on-select-buyer="handleSelectBuyer"
  />
  <Step02Properties
    v-if="currentStep === 1"
    :properties="properties"
    @on-select-property="handleSelectProperty"
  />
  <Step03ExtraClause
    v-if="currentStep === 2"
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
  <Step04Review v-if="isLastStep" :data="data" />
</template>

<script setup lang="ts">
import type { Contact } from "~/types/contacts";
import {
  Step01Objects,
  Step02Properties,
  Step03ExtraClause,
  Step04Review,
} from "./";
import type { Property } from "~/types/properties";
import type { ContractTemplate } from "../_templates";

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
  onSelectSeller: [Contact];
  onSelectBuyer: [Contact];
  onSelectProperty: [number];
  onSelectClauses: [Clause[]];
  onExtraClauseValue: [any];
  data: {
    selectedSeller?: Contact;
    selectedBuyer?: Contact;
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
    selectedSeller: Contact;
    selectedBuyer: Contact;
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

const handleSelectSeller = (contact: Contact) => {
  emits("onSelectSeller", contact);
};

const handleSelectBuyer = (contact: Contact) => {
  emits("onSelectBuyer", contact);
};

const handleSelectProperty = (id: number) => {
  emits("onSelectProperty", id);
};

const handleSelectClause = (clauses: Clause[]) => {
  emits("onSelectClauses", clauses);
};

const handleExtraClauseValue = (value: any) => {
  emits("onExtraClauseValue", value);
};
</script>
