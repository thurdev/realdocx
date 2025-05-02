<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center justify-center gap-4">
        <div>
          <Button
            variant="ghost"
            class="rounded-full w-12 h-12 hover:shadow hover:bg-white text-xl"
            @click="router.push('/contracts')"
          >
            <i class="fa-light fa-arrow-left"></i>
          </Button>
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight">
            {{ $t("contracts.create") }}
          </h2>
          <p class="text-muted-foreground">{{ $t("contracts.description") }}</p>
        </div>
      </div>
      <div class="flex items-center gap-8">
        <Button
          variant="outline"
          @click="handleDownloadMinuta"
          v-if="selectedTemplate"
          :disabled="isDownloading"
        >
          <template v-if="isDownloading">
            <div class="flex items-center gap-2">
              <Loader2 class="h-4 w-4 animate-spin" />
              {{ $t("shared.processing") }}
            </div>
          </template>
          <template v-else>
            <Download class="mr-2 h-4 w-4" />
            {{ $t("contracts.downloadMinuta") }}
            {{ selectedTemplate.downloadPrice }}€
          </template>
        </Button>
      </div>
    </div>

    <Card>
      <CardContent>
        <div class="mt-8">
          <ContractForm @selected-template="handleSelectedTemplate" />
        </div>
      </CardContent>
    </Card>

    <!--<ContractTour @step-next="handleStepNext" @tour-start="handleTourStart" @tour-complete="handleTourComplete" />-->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
  colorMode: "light",
});

import ContractForm from "./templates/ContractForm.vue";

import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNuxtApp } from "#app";
import type { Contact } from "@/types/contacts";
import type { Property } from "@/types/properties";
import type { ContractTemplate } from "@/types/contracts";
import { ContractType } from "./_contract";
import { Download, Loader2 } from "lucide-vue-next";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import type { ContractFormData } from "@/types/contracts";
import { useWallet } from "@/composable/useWallet";

const router = useRouter();
const { $t } = useNuxtApp();
const contacts = ref<Contact[]>([]);
const properties = ref<Property[]>([]);
const currentBalance = ref(0);
const currentStep = ref(1);

const locale = ref("pt");
const templates = ref<ContractTemplate[]>([]);
const isLoadingTemplates = ref(true);
const selectedTemplateId = ref<string | null>(null);
const selectedSellerId = ref<string>();
const selectedBuyerId = ref<string>();
const selectedPropertyId = ref<string>();
const selectedClausules = ref<number[]>([]);
const cpcvContainer = ref<HTMLElement | null>(null);

const selectedTemplate = computed(() => {
  return templates.value.find(
    (t) => t.id.toString() === selectedTemplateId.value
  );
});

const selectedSeller = computed(() =>
  contacts.value.find((c) => c.id?.toString() === selectedSellerId.value)
);
const selectedBuyer = computed(() =>
  contacts.value.find((c) => c.id?.toString() === selectedBuyerId.value)
);
const selectedProperty = computed(() =>
  properties.value.find((p) => p.id.toString() === selectedPropertyId.value)
);

const isSaleContract = computed(() => {
  if (!selectedTemplate.value?.type) return false;
  return selectedTemplate.value.type === ContractType.buyOrSell;
});

interface Step {
  step: number;
  title: string;
  description: string;
}

const steps = computed<Step[]>(() => {
  if (!selectedTemplate.value) return [];
  let stps = selectedTemplate.value.steps.map((step) => ({
    step: step.step,
    title: step.title[locale.value as keyof typeof step.title] || step.title.en,
    description:
      step.description[locale.value as keyof typeof step.description] ||
      step.description.en,
  }));

  const clausules = selectedTemplate.value.clausules.filter((_, index) =>
    selectedClausules.value.includes(index)
  );

  if (clausules.length > 0) {
    const lastStep = stps[stps.length - 1];
    // Ignoring since we using as the last step
    lastStep.step = -1;

    stps = [
      ...stps.filter((step) => step.step !== lastStep.step),
      ...clausules.map((clause, index) => ({
        step: stps.length + index,
        title: clause.name,
        description: clause.description,
        fields: clause.fields,
      })),
      lastStep,
    ];
  }

  return stps;
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

const wallet = useWallet();

interface MinutaResponse {
  file: string;
}

onMounted(async () => {
  try {
    contacts.value = await $fetch<Contact[]>("/api/contacts");
    properties.value = await $fetch<Property[]>("/api/properties");
    templates.value = await $fetch<ContractTemplate[]>(
      "/api/contracts/templates"
    );
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
  price: "",
  deposit: "",
  paymentMethod: "",
  duration: "",
  monthlyRent: "",
  rentDueDay: "",
});

const updateContractInputs = () => {
  if (!cpcvContainer.value) return;

  const container = cpcvContainer.value;
  const newInputs = {
    price:
      (container.querySelector("#propertyPrice") as HTMLInputElement)?.value ||
      "",
    deposit:
      (container.querySelector("#propertyDeposit") as HTMLInputElement)
        ?.value || "",
    paymentMethod:
      (container.querySelector("#paymentMethod") as HTMLInputElement)?.value ||
      "",
    duration:
      (container.querySelector("#contractDuration") as HTMLInputElement)
        ?.value || "",
    monthlyRent:
      (container.querySelector("#monthlyRent") as HTMLInputElement)?.value ||
      "",
    rentDueDay:
      (container.querySelector("#rentDueDay") as HTMLInputElement)?.value || "",
  };

  // Só atualiza se houver mudança real nos valores
  if (JSON.stringify(newInputs) !== JSON.stringify(contractInputs.value)) {
    contractInputs.value = newInputs;
  }
};

const parseCPCVHtmlToJson = (
  container: HTMLElement
): ContractFormData | null => {
  if (
    !selectedTemplate.value ||
    !selectedSeller.value ||
    !selectedBuyer.value ||
    !selectedProperty.value ||
    !selectedSeller.value.id ||
    !selectedBuyer.value.id
  ) {
    return null;
  }

  // Pegar todos os inputs e spans do container
  const inputs = container.querySelectorAll("input, span[id]");
  const formData: Record<string, any> = {};

  // Validar se os campos obrigatórios foram preenchidos
  let hasErrors = false;
  inputs.forEach((element) => {
    const value =
      element instanceof HTMLInputElement ? element.value : element.textContent;
    if (!value) {
      useToast().toast({
        title: "Erro",
        description: `Por favor, preencha o campo ${element.id}`,
        variant: "errors",
      });
      hasErrors = true;
    }
    formData[element.id] = value;
  });

  if (hasErrors) return null;

  // Base data comum para ambos os tipos de contrato
  const baseData = {
    firstPartyId: selectedSeller.value.id,
    secondPartyId: selectedBuyer.value.id,
    propertyId: selectedProperty.value.id,
    paymentMethod: formData.paymentMethod,
    contractType: selectedTemplate.value.type,
    templateId: selectedTemplate.value.id,
    price: 0,
    deposit: 0,
  };

  // Dados específicos por tipo de contrato
  if (selectedTemplate.value.type === ContractType.rent) {
    return {
      ...baseData,
      price: parseFloat(formData.monthlyRent || "0"),
      deposit: parseFloat(formData.deposit || "0"),
      duration: parseInt(formData.contractDuration || "0"),
      rentDueDay: parseInt(formData.rentDueDay || "1"),
    } as ContractFormData;
  } else {
    return {
      ...baseData,
      price: parseFloat(formData.propertyPrice || "0"),
      deposit: parseFloat(formData.propertyDeposit || "0"),
    } as ContractFormData;
  }
};

const generateContractHtml = (): string => {
  if (
    !selectedTemplate.value ||
    !selectedSeller.value ||
    !selectedBuyer.value ||
    !selectedProperty.value
  )
    return "";

  let html = selectedTemplate.value.html;

  // Substituir placeholders
  const data: Record<string, any> = {
    seller: selectedSeller.value,
    buyer: selectedBuyer.value,
    landlord: selectedBuyer.value,
    tenant: selectedSeller.value,
    property: selectedProperty.value,
  };

  // Se for contrato de arrendamento, inverte as partes
  if (selectedTemplate.value.type === ContractType.rent) {
    data.landlord = selectedSeller.value;
    data.tenant = selectedBuyer.value;
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

  return html;
};

const isSaving = ref(false);

const saveContract = async () => {
  if (cpcvContainer.value) {
    const json = parseCPCVHtmlToJson(cpcvContainer.value as HTMLElement);
    if (!json) return;

    // Criar clone do HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cpcvContainer.value.innerHTML;

    // Primeiro vamos pegar todos os valores dos inputs do container original
    const inputValues: Record<string, string> = {};
    const originalInputs = cpcvContainer.value.querySelectorAll("input");
    originalInputs.forEach((input: HTMLInputElement) => {
      inputValues[input.id] = input.value;
    });

    // Agora vamos substituir os inputs no clone pelos seus valores
    const inputs = tempDiv.querySelectorAll("input");
    inputs.forEach((input: HTMLInputElement) => {
      const span = document.createElement("span");
      // Usar o valor que guardamos do input original
      span.textContent = inputValues[input.id] || "-";
      span.id = input.id;
      input.replaceWith(span);
    });

    // Remover atributos de edição
    const editableElements = tempDiv.querySelectorAll(
      "[contenteditable], .editable"
    );
    editableElements.forEach((el) => {
      el.removeAttribute("contenteditable");
      el.classList.remove("editable");
    });

    try {
      isSaving.value = true;
      const response = await $fetch<ContractResponse>("/api/contracts", {
        method: "POST",
        body: {
          ...json,
          htmlContent: tempDiv.innerHTML,
          templateId: selectedTemplate.value?.id,
        },
      });

      if (response.success) {
        useToast().toast({
          title: $t("shared.success"),
          description: $t("shared.contractCreated"),
          variant: "success",
        });
        router.push("/contracts");
      } else if (
        response.error === "Insufficient balance" &&
        response.currentBalance !== undefined &&
        response.requiredAmount !== undefined
      ) {
        currentBalance.value = response.currentBalance;
        useToast().toast({
          title: $t("shared.error"),
          description: $t("shared.insufficientBalance", [
            response.requiredAmount,
            response.currentBalance,
          ]),
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

  if (
    currentStep.value === 2 &&
    (!selectedSellerId.value || !selectedBuyerId.value)
  ) {
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

const handleStepNext = (step: number) => {
  console.log(step);
};

const handleTourStart = () => {
  currentStep.value = 1;
};

const handleTourComplete = () => {
  currentStep.value = 1;
};

// New

const handleSelectedTemplate = (template: ContractTemplate) => {
  selectedTemplateId.value = template.id.toString();
};

const isDownloading = ref(false);

const handleDownloadMinuta = async () => {
  if (!selectedTemplate.value?.id) return;

  await wallet.fetchBalance();

  if (wallet.balance.value < selectedTemplate.value.downloadPrice) {
    useToast().toast({
      title: $t("shared.error"),
      description: $t("shared.insufficientBalance", [
        selectedTemplate.value.price,
      ]),
    });
    return;
  }

  try {
    isDownloading.value = true;
    const response = await $fetch<MinutaResponse>(
      `/api/contracts/download-minuta?id=${selectedTemplate.value.id}`
    );

    // File is in base64
    if (response.file) {
      // Decodifica o base64 para um Blob
      const byteCharacters = atob(response.file);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/docx" });

      // Cria uma URL para o Blob
      const url = window.URL.createObjectURL(blob);

      // Cria um elemento <a> para download
      const link = document.createElement("a");
      link.href = url;
      link.download = `minuta-${selectedTemplate.value.id}.docx`; // Nome do arquivo para download

      // Adiciona o link ao documento, clica nele e remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpa a URL criada
      window.URL.revokeObjectURL(url);

      useToast().toast({
        title: $t("shared.success"),
        description: $t("shared.minutaDownloaded"),
        variant: "success",
      });
      await wallet.fetchBalance();
    }
  } catch (error) {
    console.error("Error downloading minuta:", error);
    useToast().toast({
      title: $t("shared.error"),
      description: $t("shared.minutaError"),
      variant: "errors",
    });
  } finally {
    isDownloading.value = false;
  }
};
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
