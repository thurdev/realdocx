<template>
  <div v-if="!contactType">
    <div class="flex gap-2 pt-6">
      <div
        class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
        @click="setNewContactType(ContactType.Individual)"
      >
        <i class="text-3xl fa-light fa-user"></i>
        {{ $t("cpcv.contacts.modals.types.individual") }}
      </div>
      <div
        class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
        @click="setNewContactType(ContactType.Company)"
      >
        <i class="text-3xl fal fa-user-tie"></i>
        {{ $t("cpcv.contacts.modals.types.company") }}
      </div>
    </div>
  </div>

  <div v-else class="mt-8">
    <Stepper
      v-slot="{ isNextDisabled, isPrevDisabled, nextStep, prevStep }"
      v-model="currentStep"
      orientation="vertical"
      class="w-full flex gap-12"
    >
      <div class="mx-auto flex max-w-md flex-col justify-start gap-10 flex-1">
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

      <!-- STEPS CONTENT -->
      <div class="flex-1">
        <!-- Detalhes Pessoais -->
        <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 1">
          <div>
            <Label
              >{{ $t("cpcv.contacts.modals.form.inputs.name") }}
              <sup class="text-red-500">*</sup></Label
            >
            <Input
              class="tour-target-input-name"
              v-model="name"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.name')"
            />
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.nif") }}</Label>
            <Input
              class="tour-target-input-nif"
              v-model="vat"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.nif')"
            />
          </div>

          <div
            class="flex flex-col gap-2"
            v-if="contactType !== ContactType.Company"
          >
            <Label>{{
              $t("cpcv.contacts.modals.form.inputs.maritalStatus.label")
            }}</Label>
            <Select v-model="maritalStatus">
              <SelectTrigger class="tour-target-select-marital-status">
                <SelectValue
                  :placeholder="
                    $t('cpcv.contacts.modals.form.inputs.selectMaritalStatus')
                  "
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="status in maritalStatusData"
                    :key="status.value"
                    :value="status.value"
                  >
                    {{ $t(status.label) }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <template
              v-if="maritalStatus && maritalStatus === MaritalStatus.Married"
            >
              <Label class="mt-2">{{
                $t("cpcv.contacts.modals.form.inputs.marriedUnderRegime")
              }}</Label>

              <Select v-model="marriedUnderRegime">
                <SelectTrigger>
                  <SelectValue
                    :placeholder="
                      $t('cpcv.contacts.modals.form.inputs.marriedUnderRegime')
                    "
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="regime in marriedUnderRegimeData"
                      :key="regime.value"
                      :value="regime.value"
                    >
                      {{ $t(regime.label) }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div
                class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
              >
                <div class="flex items-center gap-2">
                  <i class="fa-light fa-info-circle text-blue-500"></i>
                  <p class="text-sm text-blue-700">
                    Tens de criar o contato do cônjuge para associar a este.
                  </p>
                </div>
              </div>
              <Label class="mt-2">Selecione o cônjuge</Label>
              <Select v-model="marriedContactId">
                <SelectTrigger
                  class="w-full bg-white border-gray-200 hover:border-gray-300"
                >
                  <SelectValue placeholder="Selecione o Cônjuge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup v-if="contacts.length > 0">
                    <SelectItem
                      v-for="contact in contacts"
                      :key="contact.id"
                      :value="contact.id?.toString() ?? ''"
                    >
                      <div class="flex items-center gap-2">
                        <img
                          :src="
                            contact.image ||
                            'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                          "
                          class="w-8 h-8 rounded-lg object-cover"
                          alt="Contact image"
                        />
                        <span>{{ contact.name }}</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                  <div v-else class="p-4 text-center">
                    <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
                    <NuxtLink
                      to="/contacts/create"
                      class="text-primary hover:underline font-medium"
                    >
                      Clique aqui para adicionar um contato
                    </NuxtLink>
                  </div>
                </SelectContent>
              </Select>
            </template>
          </div>
        </div>

        <!-- Endereço -->
        <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.country") }}</Label>
            <Popover v-model:open="openSearchCountry">
              <PopoverTrigger
                class="text-sm w-full text-left border border-gray-200 px-4 py-2 rounded-md bg-white hover:border-gray-300"
              >
                {{ country || "Selecione ou escreva o país" }}
              </PopoverTrigger>

              <PopoverContent class="w-full p-0">
                <Command v-model="country">
                  <CommandInput
                    placeholder="Pesquisar país..."
                    @keydown.enter="handleCountryInput"
                  />
                  <CommandList>
                    <CommandEmpty>
                      Nenhum país encontrado.
                      <br />
                      Pressione <b>enter</b> para salvar o país.
                    </CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        v-for="ctry in countries"
                        :key="ctry"
                        :value="ctry"
                        @select="openSearchCountry = false"
                      >
                        <Check
                          :class="
                            cn(
                              'mr-2 h-4 w-4',
                              country === ctry ? 'opacity-100' : 'opacity-0'
                            )
                          "
                        />
                        {{ ctry }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.district") }}</Label>
            <Popover v-model:open="openSearchDistrict">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :aria-expanded="openSearchDistrict"
                  class="w-full justify-between text-sm font-normal"
                >
                  {{ state || "Selecione ou escreva o distrito" }}
                  <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-full p-0">
                <Command v-model="state">
                  <CommandInput
                    placeholder="Pesquisar distrito..."
                    @keydown.enter="handleDistrictInput"
                  />
                  <CommandEmpty>
                    Nenhum distrito encontrado.
                    <br />
                    Pressione <b>enter</b> para salvar o distrito.
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="district in districts"
                        :key="district.value"
                        :value="district.value"
                        @select="openSearchDistrict = false"
                      >
                        <Check
                          :class="
                            cn(
                              'mr-2 h-4 w-4',
                              state === district.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )
                          "
                        />
                        {{ district.label }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.concelho") }}</Label>
            <Input
              class="tour-target-input-concelho"
              v-model="city"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.concelho')"
            />
          </div>

          <div>
            <Label>{{
              $t("cpcv.contacts.modals.form.inputs.neighborhood")
            }}</Label>
            <Input
              class="tour-target-input-neighborhood"
              v-model="neighborhood"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.neighborhood')"
            />
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.address") }}</Label>
            <Input
              class="tour-target-input-address"
              v-model="address"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.address')"
            />
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.zipCode") }}</Label>
            <Input
              class="tour-target-input-zip-code"
              v-model="zipCode"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.zipCode')"
            />
          </div>
        </div>

        <!-- Documento de Identificação -->
        <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 3">
          <div>
            <Label>Tipo de Documento</Label>
            <Select v-model="identityType">
              <SelectTrigger class="tour-target-select-identity-type">
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="citizenCard">Cartão de Cidadão</SelectItem>
                  <SelectItem value="oldIdCard"
                    >Bilhete de Identidade</SelectItem
                  >
                  <SelectItem value="passport">Passaporte</SelectItem>
                  <SelectItem value="drivingLicense">Residência</SelectItem>
                  <SelectItem value="residencePermit"
                    >Carta de Condução</SelectItem
                  >
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Número do Documento</Label>
            <Input
              class="tour-target-input-identity-number"
              v-model="identityNumber"
              placeholder="Introduza o número do documento"
            />
          </div>

          <div>
            <Label>Data de Emissão</Label>
            <Input
              class="tour-target-input-identity-expiration-date"
              type="date"
              v-model="identityExpirationDate"
              placeholder="Introduza a data de emissão"
            />
          </div>

          <div>
            <Label>Local de Emissão</Label>
            <Input
              class="tour-target-input-identity-issuer"
              v-model="identityIssuer"
              placeholder="Introduza o local de emissão"
            />
          </div>
        </div>

        <!-- Detalhes da Empresa -->
        <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 4">
          <div>
            <Label>{{
              $t("cpcv.contacts.modals.form.inputs.comercialRegistration")
            }}</Label>
            <Input
              class="tour-target-input-company-registration"
              v-model="companyRegistration"
              :placeholder="
                $t('cpcv.contacts.modals.form.inputs.comercialRegistration')
              "
            />
          </div>

          <div>
            <Label>{{
              $t("cpcv.contacts.modals.form.inputs.permanentCertificate")
            }}</Label>
            <Input
              class="tour-target-input-company-code"
              v-model="companyCode"
              :placeholder="
                $t('cpcv.contacts.modals.form.inputs.permanentCertificate')
              "
            />
          </div>

          <div>
            <Label>{{ $t("cpcv.contacts.modals.form.inputs.codeRCBE") }}</Label>
            <Input
              class="tour-target-input-company-rcbe-code"
              v-model="companyRCBECode"
              :placeholder="$t('cpcv.contacts.modals.form.inputs.codeRCBE')"
            />
          </div>

          <div>
            <Label>{{
              $t("cpcv.contacts.modals.form.inputs.socialCapital")
            }}</Label>
            <Input
              class="tour-target-input-company-social-capital"
              v-model="companySocialCapital"
              :placeholder="
                $t('cpcv.contacts.modals.form.inputs.socialCapital')
              "
            />
          </div>
        </div>

        <div
          class="flex justify-end self-end gap-2 fixed right-[1rem] bottom-[1rem] p-2 rounded"
        >
          <Button
            variant="ghost"
            @click="handleBackClick(prevStep)"
            class="mt-4"
            v-if="currentStep > 1"
          >
            {{ $t("shared.back") }}
          </Button>
          <Button
            variant="ghost"
            @click="contactType = ''"
            class="mt-4"
            v-if="currentStep === 1"
          >
            {{ $t("shared.back") }}
          </Button>
          <Button
            :disabled="currentStep === 1 && !name"
            @click="handleNextClick(nextStep)"
            class="mt-4"
          >
            {{ buttonNextLabel }}
          </Button>
        </div>
      </div>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import {
  ContactType,
  MaritalStatus,
  maritalStatusData,
  marriedUnderRegimeData,
} from "./contacts.config";
import type { Contact } from "~/pages/contacts/_contacts";

const props = defineProps<{
  contact: Contact | null;
  successMessage: string;
}>();

const contacts = ref<Contact[]>([]);

// Customer Data to be Inserted (matches schema)
const name = ref("");
const vat = ref("");
const maritalStatus = ref("");
const marriedUnderRegime = ref("");
const identityType = ref("");
const identityNumber = ref("");
const identityExpirationDate = ref("");
const identityIssuer = ref("");
const country = ref("");
const address = ref("");
const neighborhood = ref("");
const state = ref("");
const city = ref("");
const zipCode = ref("");
const companyRegistration = ref("");
const companyCode = ref("");
const companyRCBECode = ref("");
const companySocialCapital = ref("");
const contactType = ref("");
const marriedContactId = ref<string>();

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
});

import { Button } from "@/components/ui/button";
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
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
const { $t } = useNuxtApp();
import { Check, Circle, Dot, ChevronsUpDown } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

const emits = defineEmits<{
  onContactCreate: [Contact];
}>();

const stepCompany = {
  step: 4,
  title: $t(`cpcv.contacts.modals.form.steps.4.title.company`),
  description: $t(`cpcv.contacts.modals.form.steps.4.description.company`),
};

const stepsList = ref<{ step: number; title: string; description: string }[]>(
  []
);
const steps = computed(() => {
  stepsList.value = [
    {
      step: 1,
      title: $t(`cpcv.contacts.modals.form.steps.1.title.${contactType.value}`),
      description: $t(
        `cpcv.contacts.modals.form.steps.1.description.${contactType.value}`
      ),
    },
    {
      step: 2,
      title: $t(`cpcv.contacts.modals.form.steps.2.title.${contactType.value}`),
      description: $t(
        `cpcv.contacts.modals.form.steps.2.description.${contactType.value}`
      ),
    },
    {
      step: 3,
      title: $t(`cpcv.contacts.modals.form.steps.3.title.${contactType.value}`),
      description: $t(
        `cpcv.contacts.modals.form.steps.3.description.${contactType.value}`
      ),
    },
  ];

  if (contactType.value === ContactType.Individual) {
    stepsList.value = stepsList.value.filter((step) => step.step !== 4);
  } else if (stepsList.value.filter((step) => step.step === 4).length === 0) {
    stepsList.value.push(stepCompany);
  }

  return stepsList.value;
});

const currentStep = ref(1);

const setNewContactType = (type: ContactType) => {
  contactType.value = type;
};

const handleNextClick = async (func: Function) => {
  if (currentStep.value === steps.value[steps.value.length - 1].step) {
    const payload = {
      id: props.contact?.id,
      name: name.value,
      vat: vat.value,
      maritalStatus: maritalStatus.value,
      marriedUnderRegime: marriedUnderRegime.value,
      identityType: identityType.value,
      identityNumber: identityNumber.value,
      identityExpirationDate: identityExpirationDate.value,
      identityIssuer: identityIssuer.value,
      country: country.value,
      address: address.value,
      neighborhood: neighborhood.value,
      state: state.value,
      city: city.value,
      zipCode: zipCode.value,
      companyRegistration: companyRegistration.value,
      companyCode: companyCode.value,
      companyRCBECode: companyRCBECode.value,
      companySocialCapital: companySocialCapital.value,
      contactType: contactType.value,
      marriedContactId: marriedContactId.value ?? "",
    };
    const response = await $fetch<{ success?: boolean }>(
      "/api/contacts/create",
      {
        method: "POST",
        body: payload,
      }
    ).catch((err) => err.response);

    if (response.status === 422) {
      toast({
        title: "Erro ao criar o contato",
        description: "Preencha todos os campos obrigatórios",
        variant: "errors",
      });
      return;
    }

    if (response.success) {
      toast({
        title: "Sucesso!",
        description: props.successMessage ?? "Contato criado com sucesso",
        variant: "success",
      });
      emits("onContactCreate", payload);
    }

    return;
  }

  func();
};

const handleBackClick = (func: Function) => {
  if (currentStep.value === 1) {
    contactType.value = "";
    return;
  }

  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value[steps.value.length - 1].step
    ? $t("shared.save")
    : $t("shared.next");
});

watch(
  () => props.contact,
  (contact) => {
    // if contact fill the values (means that he is editing)

    if (contact) {
      contactType.value = contact.contactType;
      name.value = contact.name;
      vat.value = contact.vat;
      maritalStatus.value = contact.maritalStatus;
      marriedUnderRegime.value = contact.marriedUnderRegime;
      identityType.value = contact.identityType;
      identityNumber.value = contact.identityNumber;
      identityExpirationDate.value = contact.identityExpirationDate;
      identityIssuer.value = contact.identityIssuer;
      country.value = contact.country;
      address.value = contact.address;
      neighborhood.value = contact.neighborhood;
      state.value = contact.state;
      city.value = contact.city;
      zipCode.value = contact.zipCode;
      companyRegistration.value = contact.companyRegistration;
      companyCode.value = contact.companyCode;
      companyRCBECode.value = contact.companyRCBECode;
      companySocialCapital.value = contact.companySocialCapital;
      console.log(contact.marriedContactId);
      marriedContactId.value = String(contact.marriedContactId);
    }
  },
  { immediate: true }
);

const openSearchCountry = ref(false);
const openSearchDistrict = ref(false);

const countries = [
  "Alemanha",
  "Áustria",
  "Bélgica",
  "Bulgária",
  "Chipre",
  "Croácia",
  "Dinamarca",
  "Eslováquia",
  "Eslovénia",
  "Espanha",
  "Estónia",
  "Finlândia",
  "França",
  "Grécia",
  "Hungria",
  "Irlanda",
  "Itália",
  "Letónia",
  "Lituânia",
  "Luxemburgo",
  "Malta",
  "Países Baixos",
  "Polónia",
  "Portugal",
  "Roménia",
  "Suécia",
  "República Checa",
];

const districts = [
  { value: "Aveiro", label: "Aveiro" },
  { value: "Beja", label: "Beja" },
  { value: "Braga", label: "Braga" },
  { value: "Bragança", label: "Bragança" },
  { value: "Castelo Branco", label: "Castelo Branco" },
  { value: "Coimbra", label: "Coimbra" },
  { value: "Évora", label: "Évora" },
  { value: "Faro", label: "Faro" },
  { value: "Guarda", label: "Guarda" },
  { value: "Leiria", label: "Leiria" },
  { value: "Lisboa", label: "Lisboa" },
  { value: "Portalegre", label: "Portalegre" },
  { value: "Porto", label: "Porto" },
  { value: "Santarém", label: "Santarém" },
  { value: "Setúbal", label: "Setúbal" },
  { value: "Viana do Castelo", label: "Viana do Castelo" },
  { value: "Vila Real", label: "Vila Real" },
  { value: "Viseu", label: "Viseu" },
  { value: "Açores", label: "Açores" },
  { value: "Madeira", label: "Madeira" },
];

const handleCountryInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    country.value = (event.target as HTMLInputElement).value;
    openSearchCountry.value = false;
  }
};

const handleDistrictInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    state.value = (event.target as HTMLInputElement).value;
    openSearchDistrict.value = false;
  }
};
</script>
