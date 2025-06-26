<template>
  <Stepper
    v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
    v-model="currentStep"
    orientation="vertical"
    class="w-full flex gap-12"
  >
    <div
      id="stepper-container"
      class="mx-auto flex max-w-md flex-col justify-start gap-10 flex-1 max-h-[600px] overflow-y-auto transition-all duration-300 p-1"
      :class="[isLastStep ? 'w-0 opacity-0' : 'w-full opacity-100']"
      v-if="selectedTemplate && currentStep > -1 && isStepperVisible"
      @transitionend="handleTransitionEnd"
    >
      <StepperItem
        v-for="step in steps"
        :key="step.step"
        v-slot="{ state }"
        class="relative flex w-full items-start gap-6"
        :step="step.step"
        :data-step="step.step"
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
            class="text-sm font-semibold transition lg:text-base break-words text-wrap"
          >
            {{ step.title }}
          </StepperTitle>
          <StepperDescription :class="[state === 'active' && 'text-primary']">
            {{ step.description }}
          </StepperDescription>
        </div>
      </StepperItem>
    </div>

    <!-- Steps -->
    <DefaultTemplateStep v-if="currentStep === -1" v-model="selectedTemplate" />
    <!-- If selected template is CPCV -->
    <div
      class="flex-1 transition-all duration-500 ease-in-out"
      v-if="selectedTemplate?.type === 'CPCV' && currentStep > -1"
    >
      <h1 class="text-xl font-bold pb-4">{{ steps[currentStep].title }}</h1>
      <CPCVForm
        v-if="selectedTemplate?.type === 'CPCV' && currentStep > -1"
        :current-step="currentStep"
        :is-last-step="isLastStep"
        :extra-clauses="selectedClauses"
        :data="{
          selectedSeller,
          selectedBuyer,
          selectedProperty: selectedProperty as Property,
          selectedClauses,
          selectedTemplate,
          autoHandleSteps,
        }"
        @onSelectBuyer="handleSelectBuyer"
        @onSelectSeller="handleSelectSeller"
        @onSelectProperty="handleSelectProperty"
        @onSelectClauses="handleSelectClauses"
        @onExtraClauseValue="handleExtraClauseValue"
        @onAutoHandleStep="handleAutoHandleStep"
        @onHTMLGenerated="handleHTMLGenerated"
      />
    </div>

    <StepperButtons
      :next-step="nextStep"
      :prev-step="prevStep"
      :current-step="currentStep"
      :is-loading="isLoading"
      :disabled="isNextButtonDisabled"
      :button-next-label="buttonNextLabel"
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
import type { Property } from "~/types/properties";
import { saveContract } from ".";

const wallet = useWallet();
const { toast } = useToast();
const { $t } = useNuxtApp();

onMounted(async () => {
  // Fetch templates when the component is mounted
  await wallet.fetchBalance();
});

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
          title: "1. Outorgantes",
          description: "Preencha os dados do vendedor e comprador",
        },
        {
          step: 1,
          title: "2. Imóvel",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 2,
          title: "3. Objeto",
          description: "Clausula automaticamente preenchida pelo advogado.",
          auto: true,
        },
        {
          step: 3,
          title: "4. Onus",
          description:
            "Preencha as informações de onus do imóvel (hipotecas e penhoras).",
          auto: true,
        },
        {
          step: 4,
          title: "5. Financiamento Bancário",
          description: "Preencha as informações de financiamento bancário",
        },
        {
          step: 4,
          title: "6. Preço e condições de pagamento",
          description: "Preencha as informações de pagamento do imóvel",
        },
        {
          step: 5,
          title: "7. Escritura de compra e venda",
          description: "Preencha as informações da escritura de compra e venda",
        },
        {
          step: 6,
          title: "8. Despesas e Encargos",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 7,
          title: "9. Tradição do imóvel",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 8,
          title: "10. Incumprimento Definitivo",
          description: "Clausula automaticamente preenchida pelo advogado.",
        },
        {
          step: 9,
          title: "11. Notificações",
          description: "Selecione a forma de notificação",
        },
        {
          step: 10,
          title: "12. Alterações",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 11,
          title: "13. Branqueamento de Capitais",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 12,
          title: "14. Declarações",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 13,
          title: "15. Lei aplicável e Foro competente",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 14,
          title: "16. Reconhecimentos",
          description: "Selecione o imóvel que será utilizado no contrato",
        },
        {
          step: 15,
          title: "17. Cláusulas (Opcional)",
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
            title: $t(clause.name) + " (Extra)",
            description: $t(clause.description),
          })),
        ];
      }

      reviewStep.step = stps.length;
      stps.push(reviewStep);

      // Reordena os steps para garantir que os números estão corretos
      return stps.map((step, index) => ({
        ...step,
        step: index,
      }));
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
const htmlContent = ref("");

// CPCV Values
const selectedSeller = ref<Contact[]>([]);
const selectedBuyer = ref<Contact[]>([]);
const selectedProperty = ref<Partial<Property>>();
const selectedClauses = ref<Clause[]>([]);
const autoHandleSteps = ref<{ name: string; key: string; html: string }[]>([]);

const handleSelectBuyer = (contacts: Contact[]) => {
  selectedBuyer.value = contacts;
};

const handleSelectSeller = (contacts: Contact[]) => {
  selectedSeller.value = contacts;
};

const handleSelectProperty = (property: Partial<Property>) => {
  selectedProperty.value = property;
};

const handleSelectClauses = (clauses: Clause[]) => {
  selectedClauses.value = clauses;
};

const handleExtraClauseValue = (value: any) => {
  let clause = selectedClauses.value.find((c) => c.name === value.name);
  if (!clause) {
    return;
  }
  clause.key = value.key;
  clause.value = value.value;
  clause.html = value.html;
};

const handleAutoHandleStep = (step: {
  name: string;
  key: string;
  html: string;
}) => {
  // check if the step is already in the autoHandleSteps if yes update
  const index = autoHandleSteps.value.findIndex((s) => s.name === step.name);
  if (index !== -1) {
    autoHandleSteps.value[index] = step;
  } else {
    autoHandleSteps.value.push(step);
  }
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
      return !selectedSeller.value?.length || !selectedBuyer.value?.length;
    }

    if (currentStep.value === 1) {
      return !selectedProperty.value;
    }
  }

  return false;
});

const handleHTMLGenerated = (html: string) => {
  htmlContent.value = html;
};

const handleNextClick = async (func: Function) => {
  if (currentStep.value === -1) {
    currentStep.value = 0;
    return;
  }

  // Se for o último step, salva o contrato
  if (isLastStep.value) {
    if (!selectedProperty.value) return;

    isLoading.value = true;
    try {
      await saveContract(
        {
          firstPartyIds: selectedSeller.value.map((c) => c.id),
          secondPartyIds: selectedBuyer.value.map((c) => c.id),
          propertyId: selectedProperty.value.id,
          contractType: selectedTemplate.value?.type,
        },
        htmlContent.value,
        selectedTemplate.value?.id ?? 0
      );

      toast({
        title: $t("shared.success"),
        description: $t("shared.contractCreated"),
        variant: "success",
      });

      navigateTo("/contracts");
    } catch (error) {
      toast({
        title: $t("shared.error"),
        description: $t("shared.errorCreatingContract"),
        variant: "errors",
      });
    } finally {
      isLoading.value = false;
    }
    return;
  }

  // Se o próximo step for automático, pula para o próximo não automático
  let nextStep = currentStep.value + 1;

  // Atualiza o currentStep antes de fazer o scroll
  currentStep.value = nextStep;

  // Scroll para o stepper atual
  const stepperContainer = document.querySelector("#stepper-container");
  const activeStep = document.querySelector(
    `[data-step="${nextStep}"]`
  ) as HTMLElement;

  if (stepperContainer && activeStep && !isLastStep.value) {
    const stepHeight = 100; // altura de cada step
    const containerHeight = stepperContainer.clientHeight;
    const scrollPosition =
      nextStep * stepHeight - containerHeight / 2 + stepHeight / 2;

    stepperContainer.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
  }

  // Chama a função nextStep do Stepper
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

  // Se o step anterior for automático, pula para o anterior não automático
  let prevStep = currentStep.value - 1;

  // Atualiza o currentStep antes de fazer o scroll
  currentStep.value = prevStep;

  // Scroll para o stepper atual
  const stepperContainer = document.querySelector("#stepper-container");
  const activeStep = document.querySelector(
    `[data-step="${prevStep}"]`
  ) as HTMLElement;

  if (stepperContainer && activeStep && !isLastStep.value) {
    const stepHeight = 100; // altura de cada step
    const containerHeight = stepperContainer.clientHeight;
    const scrollPosition =
      prevStep * stepHeight - containerHeight / 2 + stepHeight / 2;

    stepperContainer.scrollTo({
      top: Math.max(0, scrollPosition),
      behavior: "smooth",
    });
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

watch(isLastStep, (newValue) => {
  if (!newValue) {
    isStepperVisible.value = true;
  }
});

const isStepperVisible = ref(true);

const handleTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName === "opacity" && isLastStep.value) {
    isStepperVisible.value = false;
  }
};

const buttonNextLabel = computed(() => {
  if (currentStep.value === -1) {
    return $t("shared.next");
  }
  return currentStep.value === steps.value.length - 1
    ? `${$t("shared.save")} (${selectedTemplate.value?.price}€)`
    : $t("shared.next");
});
</script>
