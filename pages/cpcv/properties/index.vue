<template>
  <div>
    <Card class="">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de Imóveis</h1>
          <Button @click="dialogCreatePropertyOption = true"
            >Adicionar Imóvel</Button
          >
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- <Input class="max-w-[256px]" /> -->

        <DataTable :columns="columns" :data="properties" />
      </CardContent>
    </Card>
  </div>

  <!-- DIALOG METHOD -->
  <Dialog v-model:open="dialogCreatePropertyOption">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Imóvel</DialogTitle>
        <DialogDescription>
          Selecione o método de adição do imóvel.
        </DialogDescription>

        <div class="flex gap-2">
          <div
            class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
            @click="setNewPropertyType(PropertyCreateType.URL)"
          >
            <i class="text-3xl fal fa-link"></i>
            URL
          </div>
          <div
            class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
            @click="setNewPropertyType(PropertyCreateType.Manual)"
          >
            <i class="text-3xl fal fa-pen"></i>
            Manualmente
          </div>
        </div>
      </DialogHeader>
    </DialogContent>
  </Dialog>

  <!-- DIALOG URL INSERT -->
  <Dialog v-model:open="dialogCreateByURL">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Modo URL</DialogTitle>
        <DialogDescription>
          Coloque o URL do imóvel que desejas adicionar.
        </DialogDescription>
      </DialogHeader>
      <br />
      <div>
        <Label> Introduza a URL </Label>
        <Input v-model="scrapedProperty.URL" placeholder="URL" />
        <small
          class="text-sm text-red-500"
          v-if="
            scrapedProperty.URL.length > 10 &&
            (!isValidURL || !isSupportedWebsite)
          "
        >
          <template v-if="!isValidURL"> A URL não é válida. </template>
          <template v-else-if="!isSupportedWebsite">
            <p class="text-xs">
              Não suportamos este website.
              <br />
              Apenas suportamos:
              <b> {{ supportedWebsites.join(", ") }}</b>
            </p>
            <br />
          </template>
        </small>
      </div>
      <DialogFooter>
        <Button
          @click="handleClickScrapeProperty"
          class="mt-4"
          :disabled="!scrapedProperty.URL || !isValidURL"
        >
          Continuar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <!-- DIALOG REVIEW OF PROPERTY -->
  <Dialog v-model:open="dialogReviewProperty">
    <DialogContent>
      <DialogHeader>
        <DialogTitle> Criar Imóvel</DialogTitle>
        <DialogDescription>
          Confirme os detalhes do imóvel antes de criar.
        </DialogDescription>
      </DialogHeader>
      <br />
      <!-- Imagens -->
      <Label v-if="scrapedProperty.images.length">
        Imagens apenas para verificares se são as corretas (não serão
        guardadas).
      </Label>
      <div
        v-if="scrapedProperty.images.length"
        class="flex flex-wrap gap-1 items-center justify-center max-h-[164px] overflow-y-auto"
      >
        <div
          class="flex-1"
          v-for="image in scrapedProperty.images"
          :key="image"
        >
          <img
            :src="image"
            class="min-w-[142px] w-[100%] h-[142px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <br />
      <div class="max-h-[400px] overflow-y-auto">
        <Label>Distrito</Label>
        <Input v-model="newProperty.district" placeholder="Distrito" />
        <br />
        <Label> Cidade </Label>
        <Input v-model="newProperty.city" placeholder="Cidade" />
        <br />
        <Label> Vizinhança </Label>
        <Input v-model="newProperty.neighborhood" placeholder="Vizinhança" />
        <br />
        <Label> Morada </Label>
        <Input v-model="newProperty.address" placeholder="Morada" />
        <br />
        <Label> Número </Label>
        <Input v-model="newProperty.number" placeholder="Número" />
        <br />
        <Label> Fração </Label>
        <Input v-model="newProperty.fraction" placeholder="Fração" />
        <br />
        <Label> Andar </Label>
        <Input v-model="newProperty.floor" placeholder="Andar" />
        <br />
        <Label> Código Postal </Label>
        <Input v-model="newProperty.postalCode" placeholder="Código Postal" />
        <br />
        <Label> Preço </Label>
        <Input v-model="newProperty.price" type="number" placeholder="Preço" />
        <br />
        <Label>Destino</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Destino do Imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                v-for="destine in destinations"
                :value="destine.value"
              >
                {{ destine.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <br />
        <Label> Inscrição Matricial </Label>
        <Input
          v-model="newProperty.matrixRegistration"
          placeholder="Inscrição Matricial"
        />
        <br />
        <Label> Descrição do Edifício </Label>
        <Input
          v-model="newProperty.buildingDescriptionNumber"
          placeholder="Descrição do Edifício"
        />
        <br />
        <Label> Conservatória do Registo Predial </Label>
        <Input
          v-model="newProperty.buildingDescriptionRegistry"
          placeholder="Conservatória do Registo Predial"
        />
        <br />
        <Label> Número de Licença de Utilização </Label>
        <Input
          v-model="newProperty.luNumber"
          placeholder="Número de Licença de Utilização"
        />
        <br />
        <Label> Data de Licença de Utilização </Label>
        <Input
          v-model="newProperty.luDate"
          type="date"
          placeholder="Data de Licença de Utilização"
        />
        <br />
        <Label> Emissor da Licença de Utilização </Label>
        <Input
          v-model="newProperty.luIssuer"
          placeholder="Emissor da Licença de Utilização"
        />
        <br />
        <Label> Letra do Certificado Energético </Label>
        <Input
          v-model="newProperty.ecLetter"
          placeholder="Letra do Certificado Energético"
        />
        <br />
        <Label> Número do Certificado Energético </Label>
        <Input
          v-model="newProperty.ecNumber"
          placeholder="Número do Certificado Energético"
        />
        <br />
        <Label> Validade do Certificado Energético </Label>
        <Input
          v-model="newProperty.ecValidUntil"
          type="date"
          placeholder="Validade do Certificado Energético"
        />
        <br />
        <Label> Tipo de Encargos </Label>
        <Input
          v-model="newProperty.chargesType"
          placeholder="Tipo de Encargos"
        />
        <br />
        <Label> Banco dos Encargos </Label>
        <Input
          v-model="newProperty.chargesBank"
          placeholder="Banco dos Encargos"
        />
        <br />
        <Label> AP dos Encargos </Label>
        <Input v-model="newProperty.chargesAP" placeholder="AP dos Encargos" />
        <br />
        <Label> Data dos Encargos </Label>
        <Input
          v-model="newProperty.chargesDate"
          type="date"
          placeholder="Data dos Encargos"
        />
      </div>
      <DialogFooter>
        <Button
          @click="handleClickCreateProperty"
          class="mt-4"
          :disabled="!canCreate"
        >
          Criar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
});

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const { $t } = useNuxtApp();
import { PropertyCreateType } from "./properties.config";
import type { Property } from "./_property";

const properties = ref<Property[]>([]);

enum PropertyDestination {
  HOUSING = "Housing",
  SERVICES = "Services",
  COMMERCE = "Commerce",
}

const destinations = [
  { label: "Habitação", value: PropertyDestination.HOUSING },
  { label: "Serviços", value: PropertyDestination.SERVICES },
  { label: "Comércio", value: PropertyDestination.COMMERCE },
];

const scrapedProperty = ref<{
  URL: string;
  images: string[];
  name: string;
  description: string;
  location: string;
  price: number;
  type: PropertyCreateType;
}>({
  URL: "",
  images: [],
  name: "",
  description: "",
  location: "",
  price: 0,
  type: PropertyCreateType.URL,
});

const newProperty = ref<{
  // db schema
  price: number;
  fraction: string;
  floor: string;
  destination: PropertyDestination;
  district: string;
  neighborhood: string;
  address: string;
  number: string;
  city: string;
  postalCode: string;
  matrixRegistration: string;
  buildingDescriptionNumber: string;
  buildingDescriptionRegistry: string;
  luNumber: string;
  luDate: string; // Date
  luIssuer: string;
  ecLetter: string;
  ecNumber: string;
  ecValidUntil: string; // Date
  chargesType: string; // maybe its a type need to check the values
  chargesBank: string;
  chargesAP: string;
  chargesDate: string; // Date
}>({
  price: 0,
  fraction: "",
  floor: "",
  district: "",
  destination: PropertyDestination.HOUSING,
  neighborhood: "",
  address: "",
  number: "",
  city: "",
  postalCode: "",
  matrixRegistration: "",
  buildingDescriptionNumber: "",
  buildingDescriptionRegistry: "",
  luNumber: "",
  luDate: "",
  luIssuer: "",
  ecLetter: "",
  ecNumber: "",
  ecValidUntil: "",
  chargesType: "",
  chargesBank: "",
  chargesAP: "",
  chargesDate: "",
});

const dialogCreatePropertyOption = ref(false);
const dialogCreateByURL = ref(false);
const dialogReviewProperty = ref(false);

const setNewPropertyType = (type: PropertyCreateType) => {
  dialogCreatePropertyOption.value = false;

  if (type === PropertyCreateType.URL) {
    dialogCreateByURL.value = true;
  } else {
    dialogReviewProperty.value = true;
  }
};

import { onMounted, ref } from "vue";
import { columns } from "./columns";
import DataTable from "@/components/dataTable/DataTable.vue";
import { useRoute } from "vue-router";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

onMounted(async () => {
  properties.value = await $fetch<Property[]>("/api/properties");
});

const handleClickScrapeProperty = async () => {
  const URL = scrapedProperty.value.URL;

  const { name, description, location, price, images } = await $fetch<{
    name: string;
    description: string;
    location: string;
    price: number;
    images: string[];
  }>(`/api/properties/scrape?url=${URL}`);

  if (!price) {
    toast({
      title: "Erro",
      description: "Não foi possível encontrar o imóvel.",
      variant: "errors",
    });
    return;
  }

  scrapedProperty.value = {
    URL,
    name,
    description,
    location,
    price,
    images,
    type: PropertyCreateType.URL,
  };

  // DB Schema inputs
  const splitedLoc = scrapedProperty.value.location?.split(", ") ?? [];

  newProperty.value = {
    price: scrapedProperty.value.price,
    fraction: "",
    floor: "",
    destination: PropertyDestination.HOUSING,
    // regex to remove if 2 white spaces or more, leave just 1
    district: splitedLoc.length > 1 ? splitedLoc[0] : "",
    city: splitedLoc[1],
    neighborhood:
      splitedLoc[2]
        ?.split(/\s{2,}/g)
        ?.map((v) => v.replace("Zona: ", ""))
        ?.join(", ") ?? scrapedProperty.value.location,
    address: "",
    number: "",
    postalCode: "",
    matrixRegistration: "",
    buildingDescriptionNumber: "",
    buildingDescriptionRegistry: "",
    luNumber: "",
    luDate: new Date().toISOString(),
    luIssuer: "",
    ecLetter: "",
    ecNumber: "",
    ecValidUntil: new Date().toISOString(),
    chargesType: "",
    chargesBank: "",
    chargesAP: "",
    chargesDate: new Date().toISOString(),
  };

  dialogCreateByURL.value = false;
  dialogReviewProperty.value = true;
};

const canCreate = computed(() => {
  const {
    price,
    district,
    city,
    neighborhood,
    address,
    number,
    postalCode,
    matrixRegistration,
    buildingDescriptionNumber,
    buildingDescriptionRegistry,
    luNumber,
    luDate,
    luIssuer,
    ecLetter,
    ecNumber,
    ecValidUntil,
    chargesType,
    chargesBank,
    chargesAP,
    chargesDate,
  } = newProperty.value;

  return (
    price && district && city && neighborhood && address && number && postalCode
  );
});

const supportedWebsites = [
  "remax",
  "maisconsultores",
  "idealista",
  "casa.sapo",
];

const isValidURL = computed(() => {
  const { URL } = scrapedProperty.value;
  return URL && URL.length > 10 && URL.includes("http");
});

const isSupportedWebsite = computed(() => {
  const { URL } = scrapedProperty.value;
  return (
    URL.length > 10 && supportedWebsites.some((site) => URL.includes(site))
  );
});

const handleClickCreateProperty = async () => {
  const response = await $fetch<string>("/api/properties/create", {
    method: "POST",
    body: JSON.stringify(newProperty.value),
  }).catch((err) => err.response);

  let alertType: "success" | "errors" = "errors";

  if (response.success) {
    alertType = "success";
    setTimeout(() => (window.location.href = "/cpcv/properties"), 2000);
  }

  toast({
    title: $t(`endpoints.${alertType}.label`),
    description: $t(response),
    variant: alertType,
  });
};
</script>
