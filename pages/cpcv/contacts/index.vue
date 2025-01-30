<template>
  <div>
    <Card class="max-w-[512px]">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de contatos</h1>
          <Button @click="dialogCreateContactOption = true"
            >Adicionar Contato</Button
          >
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input />
      </CardContent>
    </Card>
  </div>

  <Dialog v-model:open="dialogCreate">
    <!-- TODO: Fix mobile version steps -->
    <DialogContent
      class="w-full md:min-w-[90vw] lg:min-w-[60vw] transition-all"
    >
      <DialogHeader>
        <DialogTitle>Adicionar Contato</DialogTitle>
        <DialogDescription>
          Adicione um novo contato para a tua lista de contatos.
        </DialogDescription>
      </DialogHeader>

      <div class="mt-8">
        <Stepper
          v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
          v-model="currentStep"
          orientation="vertical"
          class="w-full flex gap-12"
        >
          <div
            class="mx-auto flex max-w-md flex-col justify-start gap-10 flex-1"
          >
            <StepperItem
              v-for="step in steps"
              :key="step.step"
              v-slot="{ state }"
              class="relative flex w-full items-start gap-6"
              :step="step.step"
            >
              <!-- <StepperSeparator
              v-if="step.step !== steps[steps.length - 1].step"
              class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
            /> -->

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

          <!-- STEPS CONTENT -->
          <div class="flex-1">
            <!-- Detalhes Pessoais -->
            <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 1">
              <div>
                <Label>Nome</Label> <Input placeholder="Introduza o nome" />
              </div>

              <div>
                <Label>NIF</Label> <Input placeholder="Introduza o NIF" />
              </div>

              <div class="flex flex-col gap-2">
                <Label>Estado Civil</Label>
                <Select v-model="newCustomer.maritalStatus">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Estado Civil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        v-for="status in maritalStatus"
                        :key="status.value"
                        :value="status.value"
                      >
                        {{ $t(status.label) }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <template
                  v-if="
                    newCustomer.maritalStatus &&
                    newCustomer.maritalStatus !== MaritalStatus.Single
                  "
                >
                  <Label>Casado sob regime</Label>
                  <Input label="Casado sob regime" />
                </template>
              </div>
            </div>

            <!-- Endereço -->
            <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
              <div>
                <Label>Endereço</Label>
                <Input placeholder="Introduza o endereço" />
              </div>

              <div>
                <Label>Freguesia</Label>
                <Input placeholder="Introduza a freguesia" />
              </div>

              <div>
                <Label>Estado</Label> <Input placeholder="Introduza o estado" />
              </div>

              <div>
                <Label>Cidade</Label> <Input placeholder="Introduza a cidade" />
              </div>

              <div>
                <Label>Código Postal</Label>
                <Input placeholder="Introduza o código postal" />
              </div>
            </div>

            <!-- Documento de Identificação -->
            <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 3">
              <div>
                <Label>Tipo de Documento</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="cc">Cartão de Cidadão</SelectItem>
                      <SelectItem value="bi">Bilhete de Identidade</SelectItem>
                      <SelectItem value="pass">Passaporte</SelectItem>
                      <SelectItem value="residence">Residência</SelectItem>
                      <SelectItem value="driver">Carta de Condução</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Número do Documento</Label>
                <Input placeholder="Introduza o número do documento" />
              </div>

              <div>
                <Label>Data de Emissão</Label>
                <Input placeholder="Introduza a data de emissão" />
              </div>

              <div>
                <Label>Local de Emissão</Label>
                <Input placeholder="Introduza o local de emissão" />
              </div>
            </div>

            <!-- Detalhes da Empresa -->
            <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 4">
              <div>
                <Label>Registro Comercial</Label>
                <Input placeholder="Introduza o registro comercial" />
              </div>

              <div>
                <Label>Certidão Permanente</Label>
                <Input placeholder="Introduza a certidão permanente" />
              </div>

              <div>
                <Label>Código RCBE</Label>
                <Input placeholder="Introduza o código RCBE" />
              </div>

              <div>
                <Label>Capital Social</Label>
                <Input placeholder="Introduza o capital social" />
              </div>
            </div>

            <div class="flex w-full h-full justify-end self-end">
              <Button
                variant="ghost"
                @click="handleBackClick(prevStep)"
                class="mt-4"
                v-if="currentStep > 1"
              >
                Voltar
              </Button>
              <Button @click="handleNextClick(nextStep)" class="mt-4">
                {{ buttonNextLabel }}
              </Button>
            </div>
          </div>
        </Stepper>
      </div>
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="dialogCreateContactOption">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Tipo de Contato</DialogTitle>
        <DialogDescription>
          Selecione o tipo de contato que deseja adicionar.
        </DialogDescription>

        <div class="flex gap-2">
          <div
            class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
            @click="setNewCustomerType(CustomerType.Individual)"
          >
            <i class="text-3xl fa-light fa-user"></i>
            Pessoa Física
          </div>
          <div
            class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
            @click="setNewCustomerType(CustomerType.Company)"
          >
            <i class="text-3xl fal fa-user-tie"></i>
            Empresa
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
});

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

import { Check, Circle, Dot } from "lucide-vue-next";

import { CustomerType, MaritalStatus } from "./contacts.config";

const stepCompany = {
  step: 4,
  title: "Detalhes da empresa",
  description: "Informações da empresa do novo contato",
};

const steps = ref([
  {
    step: 1,
    title: "Detalhes pessoais",
    description: "Informações pessoais do novo contato",
  },
  {
    step: 2,
    title: "Endereço",
    description: "Informações de endereço do novo contato",
  },
  {
    step: 3,
    title: "Documento de identificação",
    description: "Informações do documento de identificação do novo contato",
  },
]);
const currentStep = ref(1);
const dialogCreate = ref(false);
const dialogCreateContactOption = ref(false);
const maritalStatus = ref([
  {
    value: MaritalStatus.Single,
    label: "cpcv.contacts.maritalStatus.single",
  },
  {
    value: MaritalStatus.Married,
    label: "cpcv.contacts.maritalStatus.married",
  },
  {
    value: MaritalStatus.Divorced,
    label: "cpcv.contacts.maritalStatus.divorced",
  },
  {
    value: MaritalStatus.Widowed,
    label: "cpcv.contacts.maritalStatus.widowed",
  },
]);
const newCustomer = {
  type: "",
  name: "",
  vat: "",
  maritalStatus: "",
  marriedUnderRegime: "",
};

const setNewCustomerType = (type: CustomerType) => {
  newCustomer.type = type;
  dialogCreateContactOption.value = false;

  if (type === CustomerType.Individual) {
    // Remove company step
    steps.value = steps.value.filter((step) => step.step !== 4);
  }

  dialogCreate.value = true;
};

const handleNextClick = (func: Function) => {
  if (currentStep.value === steps.value[steps.value.length - 1].step) {
    // TODO: Save new contact
    return;
  }

  func();
};

const handleBackClick = (func: Function) => {
  if (currentStep.value === 1) {
    dialogCreate.value = false;
    return;
  }

  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value[steps.value.length - 1].step
    ? "Finalizar"
    : "Próximo";
});

watch(dialogCreate, (value) => {
  if (!value) {
    currentStep.value = 1;
  } else {
    if (newCustomer.type === CustomerType.Company) {
      steps.value.push(stepCompany);
    }
  }
});
</script>
