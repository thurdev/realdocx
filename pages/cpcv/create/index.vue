<template>
  <div class="flex flex-col gap-8">
    <div class="flex w-full h-[auto] gap-2 flex-col">
      <Card class="w-full flex-1">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <p class="flex-1">Criar Contractos</p>
            <Select v-model="selectedContractType">
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Selecione o Template" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem :value="ContractType.CPCV">CPCV</SelectItem>
                  <SelectItem :value="ContractType.RENT"
                    >Arrendamento</SelectItem
                  >
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-2">
          <template v-if="selectedContractType == ContractType.CPCV">
            <Label>Vendedor</Label>
            <Select v-model="selectedSeller">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="contact in contacts" :value="contact">
                    {{ contact.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label>Comprador</Label>
            <Select v-model="selectedBuyer">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Comprador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="contact in contacts" :value="contact">
                    {{ contact.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label>Imóvel</Label>
            <Select v-model="selectedProperty">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Imóvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="property in properties" :value="property">
                    [#{{ property.id }}] {{ property.district }},
                    {{ property.city }}, {{ property.neighborhood }},
                    {{ property.address }}, {{ property.number }},
                    {{ property.postalCode }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </template>
          <template v-else>
            <Label>Arrendatário</Label>
            <Select v-model="selectedSeller">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="contact in contacts" :value="contact">
                    {{ contact.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label>Senhorio</Label>
            <Select v-model="selectedBuyer">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Comprador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="contact in contacts" :value="contact">
                    {{ contact.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Label>Imóvel</Label>
            <Select v-model="selectedProperty">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o Imóvel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="property in properties" :value="property">
                    [#{{ property.id }}] {{ property.district }},
                    {{ property.city }}, {{ property.neighborhood }},
                    {{ property.address }}, {{ property.number }},
                    {{ property.postalCode }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </template>
        </CardContent>
      </Card>
      <Card class="w-full flex-1">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <h1>Preview</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div v-html="generateCPCVHtml()" ref="cpcvContainer"></div>

          <template v-if="generateCPCVHtml().length === 0">
            <div
              class="bg-gray-50 border border-gray-200 rounded flex items-center justify-center w-full h-[284px]"
            >
              <p>Preencha o fomulário, para pré-visualizar o CPCV.</p>
            </div>
          </template>
          <div v-else class="w-full flex justify-end mt-4">
            <Button @click="saveContract">Salvar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <Card class="w-full flex-1">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de Contractos Criados</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- <p>Não existem Contractos criados.</p> -->
        {{ contracts }}
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import type { Contact } from "@/pages/cpcv/contacts/_contacts";
import type { Property } from "@/pages/cpcv/properties/_property";
import type { Contract } from "./_contract";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contacts = ref<Contact[]>([]);
const properties = ref<Property[]>([]);
const contracts = ref<Contract[]>([]);
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
  contracts.value = await $fetch<Contract[]>("/api/contracts");
});

const generateCPCVHtml = (): string => {
  if (!selectedSeller.value || !selectedBuyer.value || !selectedProperty.value)
    return "";

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto;">
      <h1 style="text-align: center; font-size: 24px; font-weight: bold;">CONTRATO PROMESSA DE COMPRA E VENDA</h1>
      
      <h3>Entre os abaixo-assinados e adiante designados por:</h3>
      
      <h3>PRIMEIROS OUTORGANTES - PARTE VENDEDORA:</h3>
      <p><strong><span id="sellerName" contenteditable="true" title="Nome do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.name}</span></strong>, portador do NIF <span id="sellerVat" contenteditable="true" title="NIF do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.vat}</span>, estado civil <span id="sellerMaritalStatus" contenteditable="true" title="Estado Civil do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.maritalStatus}</span>, residente em <span id="sellerAddress" contenteditable="true" title="Endereço do Vendedor" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedSeller.value.address}</span>.</p>
      
      <h3>SEGUNDO OUTORGANTE - PARTE COMPRADORA:</h3>
      <p><strong><span id="buyerName" contenteditable="true" title="Nome do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.name}</span></strong>, portador do NIF <span id="buyerVat" contenteditable="true" title="NIF do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.vat}</span>, estado civil <span id="buyerMaritalStatus" contenteditable="true" title="Estado Civil do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.maritalStatus}</span>, residente em <span id="buyerAddress" contenteditable="true" title="Endereço do Comprador" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedBuyer.value.address}</span>.</p>
      
      <h3>Cláusula Primeira (Imóvel)</h3>
      <p><strong>Composição:</strong> Fração autónoma designada pela letra “<span id="propertyFraction" contenteditable="true" title="Fração do Imóvel" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedProperty.value.fraction}</span>”, correspondente ao <span id="propertyFloor" contenteditable="true" title="Andar do Imóvel" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;">${selectedProperty.value.floor}</span>º andar.</p>
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
        // Refresh the contracts list
        contracts.value = await $fetch<Contract[]>("/api/contracts");
      }
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  }
};
</script>
