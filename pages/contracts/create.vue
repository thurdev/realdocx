<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-8">
      <div class="">
        <Card class="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader class="bg-gray-50 border-b">
            <CardTitle class="flex justify-between items-center">
              <p class="text-xl font-semibold text-gray-800">
                {{ $t("contracts.create") }}
              </p>
              <div class="contract-type-select w-[200px]">
                <Select v-model="selectedContractType">
                  <SelectTrigger>
                    <SelectValue :placeholder="$t('contracts.selectType')" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">{{
                      $t("contracts.types.sale")
                    }}</SelectItem>
                    <SelectItem value="rent">{{
                      $t("contracts.types.rent")
                    }}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="flex flex-col gap-6">
              <div class="seller-select space-y-2">
                <Label class="text-sm font-medium text-gray-700">{{
                  selectedContractType === "CPCV" ? "Vendedor" : "Arrendatário"
                }}</Label>
                <Select v-model="selectedSeller">
                  <SelectTrigger
                    class="w-full bg-white border-gray-200 hover:border-gray-300"
                  >
                    <SelectValue placeholder="Selecione o Vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-if="contacts.length > 0">
                      <SelectItem
                        v-for="contact in contacts"
                        :key="contact.id"
                        :value="contact"
                      >
                        {{ contact.name }}
                      </SelectItem>
                    </SelectGroup>
                    <div v-else class="p-4 text-center">
                      <p class="text-gray-500 mb-2">
                        Nenhum contato cadastrado
                      </p>
                      <NuxtLink
                        to="/contacts/create"
                        class="text-primary hover:underline font-medium"
                      >
                        Clique aqui para adicionar um contato
                      </NuxtLink>
                    </div>
                  </SelectContent>
                </Select>
                {{ selectedSeller }}
              </div>

              <div class="buyer-select space-y-2">
                <Label class="text-sm font-medium text-gray-700">{{
                  selectedContractType === "CPCV" ? "Comprador" : "Senhorio"
                }}</Label>
                <Select v-model="selectedBuyer">
                  <SelectTrigger
                    class="w-full bg-white border-gray-200 hover:border-gray-300"
                  >
                    <SelectValue placeholder="Selecione o Comprador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-if="contacts.length > 0">
                      <SelectItem
                        v-for="contact in contacts"
                        :key="contact.id"
                        :value="contact"
                      >
                        {{ contact.name }}
                      </SelectItem>
                    </SelectGroup>
                    <div v-else class="p-4 text-center">
                      <p class="text-gray-500 mb-2">
                        Nenhum contato cadastrado
                      </p>
                      <NuxtLink
                        to="/contacts/create"
                        class="text-primary hover:underline font-medium"
                      >
                        Clique aqui para adicionar um contato
                      </NuxtLink>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div class="property-select space-y-2">
                <Label class="text-sm font-medium text-gray-700">Imóvel</Label>
                <Select v-model="selectedProperty">
                  <SelectTrigger
                    class="w-full bg-white border-gray-200 hover:border-gray-300"
                  >
                    <SelectValue placeholder="Selecione o Imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup v-if="properties.length > 0">
                      <SelectItem
                        v-for="property in properties"
                        :key="property.id"
                        :value="property"
                        class="py-2"
                      >
                        <div class="flex flex-col">
                          <span class="font-medium"
                            >[#{{ property.id }}] {{ property.district }}</span
                          >
                          <span class="text-sm text-gray-500">
                            {{ property.city }}, {{ property.neighborhood }},
                            {{ property.address }}, {{ property.number }}
                          </span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                    <div v-else class="p-4 text-center">
                      <p class="text-gray-500 mb-2">Nenhum imóvel cadastrado</p>
                      <NuxtLink
                        to="/properties/create"
                        class="text-primary hover:underline font-medium"
                      >
                        Clique aqui para adicionar um imóvel
                      </NuxtLink>
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- <Card class="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader class="bg-gray-50 border-b">
            <CardTitle class="flex justify-between items-center">
              <h1 class="text-xl font-semibold text-gray-800">
                {{ $t("contracts.preview") }}
              </h1>
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="preview-container bg-white rounded-lg border">
              <div
                v-html="generateCPCVHtml()"
                ref="cpcvContainer"
                class="p-6 max-h-[600px] overflow-y-auto"
              ></div>

              <template v-if="generateCPCVHtml().length === 0">
                <div
                  class="preview-section bg-gray-50 border-t border-gray-100 rounded-b flex items-center justify-center w-full h-[284px]"
                >
                  <div class="text-center">
                    <p class="text-gray-500 mb-2">
                      Preencha o formulário para pré-visualizar o contrato
                    </p>
                    <Icon
                      name="heroicons:document-text"
                      class="w-12 h-12 text-gray-400 mx-auto"
                    />
                  </div>
                </div>
              </template>
            </div>

            <div
              v-if="generateCPCVHtml().length > 0"
              class="w-full flex justify-end mt-6"
            >
              <div class="flex items-center gap-4">
                <div class="text-sm text-gray-600">
                  <p>
                    {{ $t("contracts.price") }}:
                    <span class="font-semibold">€{{ contractPrice }}</span>
                  </p>
                  <p v-if="!hasBalance" class="text-red-500">
                    {{ $t("contracts.balanceWarning", [currentBalance]) }}
                  </p>
                </div>
                <Button
                  @click="saveContract"
                  :disabled="!hasBalance"
                  class="save-button px-6 py-2 transition-all duration-200"
                  :class="{ 'opacity-50 cursor-not-allowed': !hasBalance }"
                >
                  <Save class="w-5 h-5 mr-2" v-if="hasBalance" />
                  <CreditCard class="w-5 h-5 mr-2" v-else />
                  {{ hasBalance ? "Salvar Contrato" : "Saldo Insuficiente" }}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> -->
      </div>

      <ContractTour />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import type { Contact } from "@/pages/contacts/_contacts";
import type { Property } from "@/pages/properties/_property";
import type { Contract } from "./_contract";
import { Save, CreditCard } from "lucide-vue-next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import ContractTour from "./ContractTour.vue";

const router = useRouter();
const contacts = ref<Contact[]>([]);
const properties = ref<Property[]>([]);
const hasBalance = ref(false);
const currentBalance = ref(0);
const contractPrice = ref(0.5); // Preço padrão do contrato
enum ContractType {
  CPCV = "CPCV",
  RENT = "RENT",
}
const selectedContractType = ref<string>(ContractType.CPCV);
const selectedSeller = ref<Contact>();
const selectedBuyer = ref<Contact>();
const selectedProperty = ref<Property>();

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
  properties.value = await $fetch<Property[]>("/api/properties");

  // Verificar saldo do usuário
  const { balance, error } = await $fetch("/api/wallet/balance");
  if (error) {
    console.error("Error fetching balance:", error);
    hasBalance.value = false;
    currentBalance.value = 0;
  } else {
    currentBalance.value = balance;
    hasBalance.value = balance >= contractPrice.value;
  }
});

const generateCPCVHtml = (): string => {
  if (!selectedSeller.value || !selectedBuyer.value || !selectedProperty.value)
    return "";

  return `
  
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto;position: relative;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQE14OVB93WkwYrioqAAITkdkTZQ-VkkHW7g&s" class="w-full h-full absolute opacity-10" />
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">CONTRATO PROMESSA DE COMPRA E VENDA</h1>
      
      <h3>Entre os abaixo-assinados e adiante designados por:</h3>
      
      <h3>PRIMEIROS OUTORGANTES - PARTE VENDEDORA:</h3>
      <p><strong><span id="sellerName" contenteditable="true" title="Nome do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.name}</span></strong>, portador do NIF <span id="sellerVat" contenteditable="true" title="NIF do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.vat}</span>, estado civil <span id="sellerMaritalStatus" contenteditable="true" title="Estado Civil do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.maritalStatus}</span>, residente em <span id="sellerAddress" contenteditable="true" title="Endereço do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.address}</span>.</p>
      
      <h3>SEGUNDO OUTORGANTE - PARTE COMPRADORA:</h3>
      <p><strong><span id="buyerName" contenteditable="true" title="Nome do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.name}</span></strong>, portador do NIF <span id="buyerVat" contenteditable="true" title="NIF do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.vat}</span>, estado civil <span id="buyerMaritalStatus" contenteditable="true" title="Estado Civil do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.maritalStatus}</span>, residente em <span id="buyerAddress" contenteditable="true" title="Endereço do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.address}</span>.</p>
      
      <h3>Cláusula Primeira (Imóvel)</h3>
      <p><strong>Composição:</strong> Fração autónoma designada pela letra "<span id="propertyFraction" contenteditable="true" title="Fração do Imóvel" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedProperty.value.fraction}</span>", correspondente ao <span id="propertyFloor" contenteditable="true" title="Andar do Imóvel" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedProperty.value.floor}</span>º andar.</p>
      <p><strong>Destino:</strong> <span id="propertyDestination" contenteditable="true" title="Destino do Imóvel" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedProperty.value.destination}</span>.</p>
      
      <h3>Cláusula Segunda (Preço e Condições de Pagamento)</h3>
      <p><strong>Valor Total do Imóvel (€):</strong> <input id="propertyPrice" type="number" value="" style="border: 1px solid #999; border-radius: 5px; padding: 5px; width: 100px;"></p>
      <p><strong>Forma de Pagamento:</strong> <input id="paymentMethod" type="text" value="" style="border: 1px solid #999; border-radius: 5px; padding: 5px; width: 200px;"></p>
      
      <h3>Local e Data:</h3>
      <p contenteditable="true" id="contractDate" title="Data do Contrato" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">_______________________________</p>
      
      <h3>Os Primeiros Outorgantes - Parte Vendedora:</h3>
      <p contenteditable="true" id="sellerSignature" title="Assinatura do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">_______________________________</p>
      
      <h3>Os Segundos Outorgantes - Parte Compradora:</h3>
      <p contenteditable="true" id="buyerSignature" title="Assinatura do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">_______________________________</p>
    </div>
  `;
};

const cpcvContainer = ref(null);
const parseCPCVHtmlToJson = (element: HTMLElement) => {
  if (!selectedBuyer.value || !selectedSeller.value || !selectedProperty.value)
    return null;

  return {
    selectedSeller: {
      id: selectedSeller.value.id,
      name: document.getElementById("sellerName")?.innerText || "",
      vat: document.getElementById("sellerVat")?.innerText || "",
      maritalStatus:
        document.getElementById("sellerMaritalStatus")?.innerText || "",
      address: document.getElementById("sellerAddress")?.innerText || "",
    },
    selectedBuyer: {
      id: selectedBuyer.value.id,
      name: document.getElementById("buyerName")?.innerText || "",
      vat: document.getElementById("buyerVat")?.innerText || "",
      maritalStatus:
        document.getElementById("buyerMaritalStatus")?.innerText || "",
      address: document.getElementById("buyerAddress")?.innerText || "",
    },
    selectedProperty: {
      id: selectedProperty.value.id,
      fraction: document.getElementById("propertyFraction")?.innerText || "",
      floor: document.getElementById("propertyFloor")?.innerText || "",
      destination:
        document.getElementById("propertyDestination")?.innerText || "",
    },
    contractDetails: {
      price: document.getElementById("propertyPrice")?.value || "",
      paymentMethod: document.getElementById("paymentMethod")?.value || "",
      date: document.getElementById("contractDate")?.innerText || "",
      sellerSignature:
        document.getElementById("sellerSignature")?.innerText || "",
      buyerSignature:
        document.getElementById("buyerSignature")?.innerText || "",
    },
  };
};

const saveContract = async () => {
  if (cpcvContainer.value) {
    const editedHtml = (cpcvContainer.value as HTMLElement).innerHTML;
    const json = parseCPCVHtmlToJson(cpcvContainer.value as HTMLElement);
    if (!json) return;

    try {
      const response = await $fetch("/api/contracts", {
        method: "POST",
        body: {
          selectedSeller: json.selectedSeller,
          selectedBuyer: json.selectedBuyer,
          selectedProperty: {
            ...json.selectedProperty,
            price: parseFloat(json.contractDetails.price) || 0,
          },
          htmlContent: editedHtml,
        },
      });

      if (response.success) {
        router.push("/contracts");
      } else if (response.error === "Insufficient balance") {
        // Atualizar saldo e status
        currentBalance.value = response.currentBalance;
        hasBalance.value = false;
        useToast().toast({
          title: "Saldo Insuficiente",
          description: `Você precisa de €${response.requiredAmount} para criar um contrato. Seu saldo atual é €${response.currentBalance}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving contract:", error);
      useToast().toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o contrato. Tente novamente.",
        variant: "destructive",
      });
    }
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
