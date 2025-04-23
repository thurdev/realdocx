<template>
  <Stepper
    v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
    v-model="currentStep"
    orientation="vertical"
    class="w-full flex gap-12"
  >
    <div
      class="mx-auto flex max-w-md flex-col justify-start gap-10 flex-1 max-h-[500px] overflow-y-auto"
      v-if="selectedTemplate && currentStep > -1"
    >
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="relative flex w-full items-start gap-6"
        :step="step.step"
      >
        <StepperSeparator
          v-if="step.step !== steps[steps.length - 1].step"
          class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-gray-100 group-data-[state=completed]:bg-black"
        />

        <StepperTrigger as-child>
          <Button
            :variant="
              state === 'completed' || state === 'active'
                ? 'default'
                : 'outline'
            "
            size="icon"
            class="z-10 rounded-full shrink-0"
            :class="[
              state === 'active' &&
                'ring-2 ring-ring ring-offset-2 ring-offset-background',
            ]"
            :disabled="state !== 'completed'"
          >
            <Check v-if="state === 'completed'" class="size-5" />
            <Circle v-if="state === 'active'" />
            <Dot v-if="state === 'inactive'" />
          </Button>
        </StepperTrigger>

        <div class="flex flex-col gap-1">
          <StepperTitle
            :class="[state === 'active' && 'text-primary']"
            class="text-sm font-semibold transition lg:text-base"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription
            :class="[state === 'active' && 'text-primary']"
            class="sr-only text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
          >
            {{ step.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <!-- Steps -->
    <DefaultTemplateStep v-if="currentStep === -1" v-model="selectedTemplate" />
    <!-- If selected template is CPCV -->
    <CPCVForm
      v-if="selectedTemplate?.type === 'CPCV' && currentStep > -1"
      :current-step="currentStep"
      :is-last-step="isLastStep"
      :extra-clauses="selectedClauses"
      :data="{
        selectedSeller,
        selectedBuyer,
        selectedProperty,
        selectedClauses,
        selectedTemplate,
      }"
      @onSelectBuyer="handleSelectBuyer"
      @onSelectSeller="handleSelectSeller"
      @onSelectProperty="handleSelectProperty"
      @onSelectClauses="handleSelectClauses"
      @onExtraClauseValue="handleExtraClauseValue"
    />

    <StepperButtons
      :next-step="nextStep"
      :prev-step="prevStep"
      :current-step="currentStep"
      :is-loading="isLoading"
      :disabled="isNextButtonDisabled"
      :button-next-label="$t('shared.next')"
      @next="handleNextClick"
      @back="handleBackClick"
    />
  </Stepper>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from "vue";

import { useWallet } from "~/composable/useWallet";
import { useToast } from "~/components/ui/toast";
import { Check, Circle, Dot } from "lucide-vue-next";
import StepperLoader from "./components/StepperLoader.vue";
import StepperButtons from "./components/StepperButtons.vue";
import DefaultTemplateStep from "./DefaultTemplateStep.vue";
import CPCVForm, { type Clause } from "./cpcv/CPCVForm.vue";
import type { ContractTemplate } from "./_templates";
import type { Contact } from "~/types/contacts";

const wallet = useWallet();
const { toast } = useToast();

onMounted(async () => {
  // Fetch templates when the component is mounted
  await wallet.fetchBalance();
});

interface Step {
  step: number;
  title: string;
  description: string;
}

const steps = computed(() => {
  if (!selectedTemplate.value) {
    return [];
  }

  const type = selectedTemplate.value.type;

  switch (type) {
    case "CPCV":
      let stps = [
        {
          step: 0,
          title: "Partes",
          description: "Preencha os dados do vendedor e comprador",
        },
        {
          step: 1,
          title: "Imóvel",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 2,
          title: "Cláusulas",
          description:
            "Selecione as cláusulas adicionais que desejas incluir no contrato",
        },
      ];

      const reviewStep = {
        step: -1,
        title: "Revisão",
        description: "Revise os dados do contrato",
      };

      if (selectedClauses.value.length > 0) {
        stps = [
          ...stps,
          ...selectedClauses.value.map((clause, index) => ({
            step: stps.length + index,
            title: clause.name + "(Extra)",
            description: clause.description,
          })),
        ];
      }

      reviewStep.step = stps.length;
      stps.push(reviewStep);

      return stps;
    default:
      return [];
  }
});

const isLastStep = computed(() => {
  if (!selectedTemplate.value) {
    return false;
  }

  const type = selectedTemplate.value.type;

  switch (type) {
    case "CPCV":
      return currentStep.value === steps.value.length - 1;
    default:
      return false;
  }
});

// Default
const selectedTemplate = ref<ContractTemplate>();
const currentStep = ref(-1);
const isLoading = ref(false);

// CPCV Values
const selectedSeller = ref<Contact>();
const selectedBuyer = ref<Contact>();
const selectedProperty = ref<number>();
const selectedClauses = ref<Clause[]>([]);

const handleSelectBuyer = (contact: Contact) => {
  selectedSeller.value = contact;
};

const handleSelectSeller = (contact: Contact) => {
  selectedBuyer.value = contact;
};

const handleSelectProperty = (propertyId: number) => {
  selectedProperty.value = propertyId;
};

const handleSelectClauses = (clauses: Clause[]) => {
  console.log(clauses);
  selectedClauses.value = clauses;
};

const handleExtraClauseValue = (value: any) => {
  let clause = selectedClauses.value.find((c) => c.name === value.name);
  if (!clause) {
    return;
  }
  console.log("found");
  clause.key = value.key;
  clause.value = value.value;
  clause.html = value.html;
  console.log("updated", clause);
};

const isNextButtonDisabled = computed(() => {
  // Disable the next button if the current step is 0 and no template is selected
  if (currentStep.value === -1) {
    // If has template selected
    if (selectedTemplate.value?.id) {
      // Check if has balance
      if (!wallet.hasBalance(selectedTemplate.value.price)) {
        return true;
      }
    }
    return !selectedTemplate.value?.id;
  }

  if (selectedTemplate.value?.type === "CPCV") {
    // Check if the current step has value selected
    if (currentStep.value === 0) {
      return !selectedSeller.value || !selectedBuyer.value;
    }

    if (currentStep.value === 1) {
      return !selectedProperty.value;
    }
  }

  return false;
});

const handleNextClick = async (func: Function) => {
  if (currentStep.value === -1) {
    currentStep.value = 0;
    return;
  }

  // console.log({
  //   selectedSeller: selectedSeller.value,
  //   selectedBuyer: selectedBuyer.value,
  //   selectedProperty: selectedProperty.value,
  //   selectedClauses: selectedClauses.value,
  // });

  // Validações por step

  // if (
  //   currentStep.value === 2 &&
  //   (!selectedSellerId.value || !selectedBuyerId.value)
  // ) {
  //   toast({
  //     title: "Erro",
  //     description: "Por favor, selecione ambas as partes do contrato",
  //     variant: "errors",
  //   });
  //   return;
  // }

  // if (currentStep.value === 3 && !selectedPropertyId.value) {
  //   toast({
  //     title: "Erro",
  //     description: "Por favor, selecione um imóvel",
  //     variant: "errors",
  //   });
  //   return;
  // }

  // if (currentStep.value === steps.value.length) {
  //   await saveContract();
  //   return;
  // }

  func();
};

const handleBackClick = (func: Function) => {
  if (currentStep.value === -1) {
    return;
  }

  if (currentStep.value === 0) {
    currentStep.value = -1;
    return;
  }

  func();
};

const emit = defineEmits<{
  selectedTemplate: [ContractTemplate];
}>();

watch(
  () => selectedTemplate.value,
  (newValue) => {
    if (!newValue) {
      return;
    }
    emit("selectedTemplate", newValue);
  }
);
</script>
