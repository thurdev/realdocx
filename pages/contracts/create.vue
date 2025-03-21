<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ $t("contracts.create") }}</h2>
        <p class="text-muted-foreground">{{ $t("contracts.description") }}</p>
      </div>
      <div>
        <Button variant="outline" @click="router.push('/contracts')">
          <i class="fa-light fa-arrow-left mr-2"></i>
          {{ $t("shared.back") }}
        </Button>
      </div>
    </div>

    <Card>
      <CardContent>
        <div class="mt-8">
          <Stepper
            v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
            v-model="currentStep"
            orientation="vertical"
            class="w-full flex gap-12"
          >
            <div class="mx-auto flex max-w-md flex-col justify-start gap-10 flex-1">
              <template v-if="!selectedTemplate">
                <div v-for="i in 4" :key="i" class="flex items-center gap-4">
                  <Skeleton class="h-10 w-10 rounded-full" />
                  <div class="space-y-2">
                    <Skeleton class="h-4 w-[200px]" />
                    <Skeleton class="h-4 w-[160px]" />
                  </div>
                </div>
              </template>
              <StepperItem
                v-else
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
                    :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                    size="icon"
                    class="z-10 rounded-full shrink-0"
                    :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
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
              <!-- Tipo de Contrato -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 1">
                <div>
                  <Label>{{ $t("contracts.type") }}</Label>
                  <Select v-model="selectedTemplateId">
                    <SelectTrigger class="contract-type-select">
                      <div v-if="isLoadingTemplates" class="flex items-center gap-2">
                        <Loader2 class="h-4 w-4 animate-spin" />
                        <span>{{ $t("shared.loading") }}</span>
                      </div>
                      <SelectValue v-else :placeholder="$t('contracts.selectType')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem v-for="template in templates" :key="template.id" :value="template.id.toString()">
                        {{ template.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div v-if="!selectedTemplateId" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div class="flex items-center gap-2">
                    <i class="fa-light fa-info-circle text-blue-500"></i>
                    <p class="text-sm text-blue-700">
                      {{ $t("contracts.selectTypeInfo") }}
                    </p>
                  </div>
                </div>

                <div v-if="selectedTemplateId" class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div class="flex items-center gap-2">
                    <i class="fa-light fa-info-circle text-yellow-500"></i>
                    <p class="text-sm text-yellow-700">
                      Este contrato tem um custo de €{{ selectedTemplate?.price }}. 
                      <span v-if="!hasBalance" class="font-medium">
                        Seu saldo atual é €{{ currentBalance }}. 
                        <NuxtLink to="/wallet" class="text-primary hover:underline">
                          Clique aqui para adicionar saldo
                        </NuxtLink>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Partes do Contrato -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
                <div class="seller-select space-y-2">
                  <Label class="text-sm font-medium text-gray-700">
                    {{ isSaleContract ? "Vendedor" : "Arrendatário" }}
                  </Label>
                  <Select v-model="selectedSellerId">
                    <SelectTrigger class="w-full bg-white border-gray-200 hover:border-gray-300">
                      <SelectValue :placeholder="isSaleContract ? 'Selecione o Vendedor' : 'Selecione o Arrendatário'" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-if="contacts.length > 0">
                        <SelectItem v-for="contact in contacts" :key="contact.id" :value="contact.id?.toString() || ''">
                          {{ contact.name }}
                        </SelectItem>
                      </SelectGroup>
                      <div v-else class="p-4 text-center">
                        <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
                        <NuxtLink to="/contacts/create" class="text-primary hover:underline font-medium">
                          Clique aqui para adicionar um contato
                        </NuxtLink>
                      </div>
                    </SelectContent>
                  </Select>
                </div>

                <div class="buyer-select space-y-2">
                  <Label class="text-sm font-medium text-gray-700">
                    {{ isSaleContract ? "Comprador" : "Senhorio" }}
                  </Label>
                  <Select v-model="selectedBuyerId">
                    <SelectTrigger class="w-full bg-white border-gray-200 hover:border-gray-300">
                      <SelectValue :placeholder="isSaleContract ? 'Selecione o Comprador' : 'Selecione o Senhorio'" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-if="contacts.length > 0">
                        <SelectItem 
                          v-for="contact in contacts.filter(c => c.id?.toString() !== selectedSellerId)" 
                          :key="contact.id" 
                          :value="contact.id?.toString() || ''"
                        >
                          {{ contact.name }}
                        </SelectItem>
                      </SelectGroup>
                      <div v-else class="p-4 text-center">
                        <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
                        <NuxtLink to="/contacts/create" class="text-primary hover:underline font-medium">
                          Clique aqui para adicionar um contato
                        </NuxtLink>
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Imóvel -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 3">
                <div class="property-select space-y-2">
                  <Label class="text-sm font-medium text-gray-700">Imóvel</Label>
                  <Select v-model="selectedPropertyId">
                    <SelectTrigger class="w-full bg-white border-gray-200 hover:border-gray-300">
                      <SelectValue placeholder="Selecione o Imóvel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup v-if="properties.length > 0">
                        <SelectItem v-for="property in properties" :key="property.id" :value="property.id.toString()">
                          <div class="flex flex-col">
                            <span class="font-medium">[#{{ property.id }}]</span>
                            <span class="text-sm text-gray-500">
                              {{ property.city }}, {{ property.neighborhood }},
                              {{ property.address }}, {{ property.number }}
                            </span>
                          </div>
                        </SelectItem>
                      </SelectGroup>
                      <div v-else class="p-4 text-center">
                        <p class="text-gray-500 mb-2">Nenhum imóvel cadastrado</p>
                        <NuxtLink to="/properties/create" class="text-primary hover:underline font-medium">
                          Clique aqui para adicionar um imóvel
                        </NuxtLink>
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Preview do Contrato -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 4">
                <div class="preview-section" ref="cpcvContainer" v-once v-html="generateContractHtml()"></div>
              </div>

              <div class="flex w-full h-full justify-end self-end gap-2">
                <Button
                  variant="ghost"
                  @click="handleBackClick(prevStep)"
                  class="mt-4"
                  v-if="currentStep > 1"
                >
                  {{ $t("shared.back") }}
                </Button>
                <Button @click="handleNextClick(nextStep)" class="mt-4" :disabled="currentStep === 1 && selectedTemplateId && !hasBalance">
                  <Loader2 v-if="isSaving" class="mr-2 h-4 w-4 animate-spin" />
                  {{ buttonNextLabel }}
                </Button>
              </div>
            </div>
          </Stepper>
        </div>
      </CardContent>
    </Card>

    <ContractTour @step-next="handleStepNext" @tour-start="handleTourStart" @tour-complete="handleTourComplete" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
  colorMode: "light",
});

import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useNuxtApp } from '#app';
import type { Contact } from '@/types/contacts';
import type { Property } from '@/types/properties';
import type { ContractTemplate } from '@/types/contracts';
import type { Contract } from "./_contract";
import { ContractType } from '@prisma/client';
import type { ContractStep } from "@/templates/contracts/types";
import { generateCPCVHtml } from "@/templates/contracts/cpcv";
import { generateRentHtml } from "@/templates/contracts/rent";
import { Save, CreditCard } from "lucide-vue-next";
import { PRICES } from '~/server/config/prices';

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import ContractTour from "./ContractTour.vue";
import { useToast } from "@/components/ui/toast/use-toast";
import type { ContractFormData } from '@/types/contracts'
import { Loader2 } from "lucide-vue-next";

const router = useRouter();
const { $t } = useNuxtApp();
const contacts = ref<Contact[]>([]);
const properties = ref<Property[]>([]);
const currentBalance = ref(0);
const currentStep = ref(1);

const locale = ref('pt');
const templates = ref<ContractTemplate[]>([]);
const isLoadingTemplates = ref(true);
const selectedTemplateId = ref<string | null>(null);
const selectedSellerId = ref<string>();
const selectedBuyerId = ref<string>();
const selectedPropertyId = ref<string>();
const cpcvContainer = ref<HTMLElement | null>(null);

const selectedTemplate = computed(() => {
  return templates.value.find(t => t.id.toString() === selectedTemplateId.value);
});

const selectedSeller = computed(() => contacts.value.find(c => c.id?.toString() === selectedSellerId.value));
const selectedBuyer = computed(() => contacts.value.find(c => c.id?.toString() === selectedBuyerId.value));
const selectedProperty = computed(() => properties.value.find(p => p.id.toString() === selectedPropertyId.value));

const isSaleContract = computed(() => {
  if (!selectedTemplate.value?.type) return false;
  return selectedTemplate.value.type === ContractType.SALE;
});

interface Step {
  step: number;
  title: string;
  description: string;
}

const steps = computed<Step[]>(() => {
  if (!selectedTemplate.value) return [];
  return selectedTemplate.value.steps.map(step => ({
    step: step.step,
    title: step.title[locale.value as keyof typeof step.title] || step.title.en,
    description: step.description[locale.value as keyof typeof step.description] || step.description.en
  }));
});

interface WalletResponse {
  balance?: number;
  error?: string;
  totalCredits?: number;
  totalDebits?: number;
}

interface ContractResponse {
  success?: boolean;
  error?: string;
  currentBalance?: number;
  requiredAmount?: number;
  status?: string;
}

onMounted(async () => {
  try {
    contacts.value = await $fetch<Contact[]>("/api/contacts");
    properties.value = await $fetch<Property[]>("/api/properties");
    templates.value = await $fetch<ContractTemplate[]>("/api/contracts/templates");
  } catch (error) {
    console.error("Error fetching data:", error);
    useToast().toast({
      title: "Erro",
      description: "Ocorreu um erro ao carregar os dados. Tente novamente.",
      variant: "errors",
    });
  } finally {
    isLoadingTemplates.value = false;
  }

  // Verificar saldo do usuário
  const response = await $fetch<WalletResponse>("/api/wallet/balance");
  if (response.error) {
    console.error("Error fetching balance:", response.error);
    currentBalance.value = 0;
  } else if (response.balance !== undefined) {
    currentBalance.value = response.balance;
  }
});

const contractInputs = ref({
  price: '',
  deposit: '',
  paymentMethod: '',
  duration: '',
  monthlyRent: '',
  rentDueDay: ''
});

const updateContractInputs = () => {
  if (!cpcvContainer.value) return;
  
  const container = cpcvContainer.value;
  const newInputs = {
    price: (container.querySelector('#propertyPrice') as HTMLInputElement)?.value || '',
    deposit: (container.querySelector('#propertyDeposit') as HTMLInputElement)?.value || '',
    paymentMethod: (container.querySelector('#paymentMethod') as HTMLInputElement)?.value || '',
    duration: (container.querySelector('#contractDuration') as HTMLInputElement)?.value || '',
    monthlyRent: (container.querySelector('#monthlyRent') as HTMLInputElement)?.value || '',
    rentDueDay: (container.querySelector('#rentDueDay') as HTMLInputElement)?.value || ''
  };

  // Só atualiza se houver mudança real nos valores
  if (JSON.stringify(newInputs) !== JSON.stringify(contractInputs.value)) {
    contractInputs.value = newInputs;
  }
};

const parseCPCVHtmlToJson = (container: HTMLElement): ContractFormData | null => {
  if (!selectedTemplate.value || !selectedSeller.value || !selectedBuyer.value || !selectedProperty.value || !selectedSeller.value.id || !selectedBuyer.value.id) {
    return null;
  }

  // Pegar todos os inputs do container
  const inputs = container.querySelectorAll('input');
  const formData: Record<string, any> = {};

  // Validar se os campos obrigatórios foram preenchidos
  let hasErrors = false;
  inputs.forEach((input: HTMLInputElement) => {
    if (!input.value) {
      useToast().toast({
        title: "Erro",
        description: `Por favor, preencha o campo ${input.id}`,
        variant: "errors",
      });
      hasErrors = true;
    }
    formData[input.id] = input.value;
  });

  if (hasErrors) return null;

  return {
    firstPartyId: selectedSeller.value.id,
    secondPartyId: selectedBuyer.value.id,
    propertyId: selectedProperty.value.id,
    price: parseFloat(formData.propertyPrice || '0'),
    deposit: parseFloat(formData.propertyDeposit || '0'),
    paymentMethod: formData.paymentMethod,
    contractType: selectedTemplate.value.type,
    templateId: selectedTemplate.value.id
  };
};

const generateContractHtml = (): string => {
  if (!selectedTemplate.value || !selectedSeller.value || !selectedBuyer.value || !selectedProperty.value)
    return "";

  let html = selectedTemplate.value.html;

  // Substituir placeholders
  const data: Record<string, any> = {
    seller: selectedSeller.value,
    buyer: selectedBuyer.value,
    landlord: selectedSeller.value,
    tenant: selectedBuyer.value,
    property: selectedProperty.value
  };

  // Substituir todos os placeholders {{variavel}} pelos valores reais
  html = html.replace(/\{\{([^}]+)\}\}/g, (match: string, key: string) => {
    const keys = key.trim().split('.');
    let value: any = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value?.toString() || '';
  });

  return html;
};

const isSaving = ref(false);

const saveContract = async () => {
  if (cpcvContainer.value) {
    const json = parseCPCVHtmlToJson(cpcvContainer.value as HTMLElement);
    if (!json) return;

    // Criar clone do HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cpcvContainer.value.innerHTML;

    // Primeiro vamos pegar todos os valores dos inputs do container original
    const inputValues: Record<string, string> = {};
    const originalInputs = cpcvContainer.value.querySelectorAll('input');
    originalInputs.forEach((input: HTMLInputElement) => {
      inputValues[input.id] = input.value;
    });

    // Agora vamos substituir os inputs no clone pelos seus valores
    const inputs = tempDiv.querySelectorAll('input');
    inputs.forEach((input: HTMLInputElement) => {
      const span = document.createElement('span');
      // Usar o valor que guardamos do input original
      span.textContent = inputValues[input.id] || '-';
      span.id = input.id;
      input.replaceWith(span);
    });

    // Remover atributos de edição
    const editableElements = tempDiv.querySelectorAll('[contenteditable], .editable');
    editableElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.classList.remove('editable');
    });

    try {
      isSaving.value = true;
      const response = await $fetch<ContractResponse>("/api/contracts", {
        method: "POST",
        body: {
          ...json,
          htmlContent: tempDiv.innerHTML,
          templateId: selectedTemplate.value?.id
        },
      });

      if (response.success) {
        useToast().toast({
          title: $t("shared.success"),
          description: $t("shared.contractCreated"),
          variant: "success",
        });
        router.push("/contracts");
      } else if (response.error === "Insufficient balance" && response.currentBalance !== undefined && response.requiredAmount !== undefined) {
        currentBalance.value = response.currentBalance;
        useToast().toast({
          title: $t("shared.error"),
          description: $t("shared.insufficientBalance", { 
            amount: response.requiredAmount, 
            balance: response.currentBalance 
          }),
          variant: "errors",
        });
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      useToast().toast({
        title: $t("shared.error"),
        description: $t("shared.contractError"),
        variant: "errors",
      });
    } finally {
      isSaving.value = false;
    }
  }
};

const handleNextClick = async (func: Function) => {
  // Validações por step
  if (currentStep.value === 1 && !selectedTemplateId.value) {
    useToast().toast({
      title: "Erro",
      description: "Por favor, selecione um tipo de contrato",
      variant: "errors",
    });
    return;
  }

  if (currentStep.value === 2 && (!selectedSellerId.value || !selectedBuyerId.value)) {
    useToast().toast({
      title: "Erro",
      description: "Por favor, selecione ambas as partes do contrato",
      variant: "errors",
    });
    return;
  }

  if (currentStep.value === 3 && !selectedPropertyId.value) {
    useToast().toast({
      title: "Erro",
      description: "Por favor, selecione um imóvel",
      variant: "errors",
    });
    return;
  }

  if (currentStep.value === steps.value.length) {
    await saveContract();
    return;
  }

  func();
};

const handleBackClick = (func: Function) => {
  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value.length ? $t("shared.save") : $t("shared.next");
});

const handleStepNext = (step: number) => {
  console.log(step);
};

const handleTourStart = () => {
  currentStep.value = 1;
};

const handleTourComplete = () => {
  currentStep.value = 1;
};

const hasBalance = computed(() => {
  if (!selectedTemplate.value?.price) return true;
  return currentBalance.value >= selectedTemplate.value.price;
});
</script>

<style>
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

select:focus {
  outline: none;
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring));
}

.preview-container {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.preview-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Estilização do scroll do preview */
.preview-container ::-webkit-scrollbar {
  width: 8px;
}

.preview-container ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.preview-container ::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.preview-container ::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
