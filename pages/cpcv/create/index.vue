<template>
  <div class="flex flex-col gap-8">
    <div class="flex w-full h-[auto] gap-4 flex-col md:flex-row">
      <Card class="w-full flex-1">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <h1>Criar CPCV</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Vendedor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Vendedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="contact in contacts"
                  :value="String(contact.id)"
                >
                  {{ contact.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <br />
          <Label>Comprador</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Comprador" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="contact in contacts"
                  :value="String(contact.id)"
                >
                  {{ contact.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <br />
          <Label>Imóvel</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o Imóvel" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="property in properties"
                  :value="String(property.id)"
                >
                  {{ property.district }}, {{ property.city }},
                  {{ property.neighborhood }}, {{ property.address }},
                  {{ property.number }}, {{ property.postalCode }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <br />
          <div class="w-full flex justify-end">
            <Button>Criar CPCV</Button>
          </div>
        </CardContent>
      </Card>
      <Card class="w-full flex-1">
        <CardHeader>
          <CardTitle class="flex justify-between items-center">
            <h1>Preview</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <iframe
            v-if="fileUrl"
            class="w-full h-[500px]"
            :src="fileUrl"
          ></iframe>
          <template v-else>
            <div
              class="bg-gray-50 border border-gray-200 rounded flex items-center justify-center w-full h-[284px]"
            >
              <p>Preencha o fomulário, para pré-visualizar o CPCV.</p>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>
    <Card class="w-full flex-1">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de CPCV's Criados</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Não existem CPCV's criados.</p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import axios from "axios";
import type { Contact } from "@/pages/cpcv/contacts/_contacts";
import type { Property } from "@/pages/cpcv/properties/_property";

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

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
  properties.value = await $fetch<Property[]>("/api/properties");
});

const fileUrl = ref("");

const payload = {
  filename: "CPCV",
  primeiroOrtogantes: [
    {
      nome: "João Silva",
      freguesia: "Santa Maria",
      concelho: "Lisboa",
      nif: "123456789",
      cartaoCidadao: {
        number: "1234567890",
        expirationDate: "2025-12-31",
      },
      estadoCivil: "Solteiro",
      casadoSobRegime: "Comunhão de Bens",
      casadoComDomicilio: "Lisboa",
      matriculaComercial: "12345",
      certidaoPermanente: "67890",
      codigoRCBE: "112233",
      sedeRCBE: "Lisboa",
      capitalSocial: "100000",
      acto: "Compra e Venda",
    },
  ],
  segundoOrtogantes: [
    {
      nome: "Maria Oliveira",
      freguesia: "São João",
      concelho: "Porto",
      nif: "987654321",
      cartaoCidadao: {
        number: "0987654321",
        expirationDate: "2024-11-30",
      },
      estadoCivil: "Casada",
      casadoSobRegime: "Separação de Bens",
      casadoComDomicilio: "Porto",
      matriculaComercial: "54321",
      certidaoPermanente: "09876",
      codigoRCBE: "445566",
      sedeRCBE: "Porto",
      capitalSocial: "200000",
      acto: "Arrendamento",
    },
  ],
  clauses: {
    options: {
      licenseOptions: null,
      hasEquipmentsInTheProperty: true,
      willItBePaidByTheMediator: false,
      fifteenthClause: true,
    },
    values: {
      firstGrantors: "João Silva",
      secondGrantors: "Maria Oliveira",
      firstClauseCompositionLetter: "A",
      firstClauseCompositionFloor: "1",
      firstClauseDestination: "Residencial",
      firstClauseStreet: "Rua das Flores",
      firstClauseFreguesia: "Santa Maria",
      firstClauseConcelho: "Lisboa",
      firstClauseArticleType: "Urbano",
      firstClauseArticleNumber: "123",
      firstClauseArticleFreguesia: "Santa Maria",
      firstClausePredialNumber: "456",
      firstClausePredialFreguesia: "Santa Maria",
      firstClausePredialConservatoria: "Lisboa",
      firstClausePredialRegisteredAt: "2020-01-01",
      firstClauseLicenseUtilizationNumber: "789",
      firstClauseLicenseIssuedAt: "2019-12-31",
      firstClauseLicenseIssuedBy: "Câmara Municipal de Lisboa",
      firstClauseLicenseOptions: "N/A",
      firstClauseEnergyCertificationNumber: "123456",
      firstClauseEnergyCertificationValidUntil: "2025-12-31",
      firstClauseEnergyCertificationLetter: "B",
      firstClauseEnergyCertificationExtra: "N/A",
      firstClauseMortgageInFavorOf: "Banco ABC",
      firstClauseMortgageA: "100000",
      firstClauseMortgageB: "50000",
      secondClauseEquipmentsInTheProperty: "Sim",
      thirdClausePriceGross: "150000",
      thirdClauseRawPriceGross: "150000",
      thirdClausePriceLiquid: "140000",
      thirdClauseRawPriceLiquid: "140000",
      thirdClausePaymentDate: "2023-12-31",
      thirdClauseEntity: "Banco XYZ",
      thirdClauseReference: "REF123",
      thirdClauseOptional: "N/A",
      thirdClauseSecondPrice: "50000",
      thirdClauseSecondRawPrice: "50000",
      thirdClauseThirdPrice: "25000",
      thirdClauseThirdRawPrice: "25000",
      fifthClauseMaxDaysToPay: "30",
      fifthClauseMaxRawDaysToPay: "30",
      sixteenthDesignation: "Imobiliária ABC",
      sixteenthNif: "123456789",
      sixteenthAMILicense: "AMI12345",
      sixteenthFirstGrantors: "João Silva",
      sixteenthSecondGrantors: "Maria Oliveira",
    },
    extraParams: {
      iban: "PT50000201231234567890154",
      bank: "Banco XYZ",
    },
  },
};

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://178.62.110.208:4000/api/docx/generate",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify(payload),
};

// axios
//   .request(config)
//   .then((response) => {
//     // is a blob add to iframe
//     // the file is in docx format convert to pdf
//     const file = new Blob([response.data], { type: "application/pdf" });
//     fileUrl.value = URL.createObjectURL(file);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
</script>
