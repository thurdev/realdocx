<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          {{ $t("cpcv.contacts.modals.contactType") }}
        </h2>
        <p class="text-muted-foreground">
          {{ $t("cpcv.contacts.modals.contactTypeDescription") }}
        </p>
      </div>
      <div>
        <Button variant="outline" @click="router.push('/contacts')">
          <i class="fa-light fa-arrow-left mr-2"></i>
          {{ $t("shared.back") }}
        </Button>
      </div>
    </div>

    <Card>
      <CardContent>
        <div v-if="!selectedType">
          <div class="flex gap-2 pt-6">
            <div
              class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
              @click="setNewCustomerType(CustomerType.Individual)"
            >
              <i class="text-3xl fa-light fa-user"></i>
              {{ $t("cpcv.contacts.modals.types.individual") }}
            </div>
            <div
              class="flex flex-1 flex-col gap-4 items-center justify-center min-h-[128px] border-1 border rounded cursor-pointer hover:shadow-md transition-all hover:bg-gray-100"
              @click="setNewCustomerType(CustomerType.Company)"
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
                  <Label>{{ $t("cpcv.contacts.modals.form.inputs.name") }}</Label>
                  <Input
                    class="tour-target-input-name"
                    v-model="newCustomer.name"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.name')"
                  />
                </div>

                <div>
                  <Label>{{ $t("cpcv.contacts.modals.form.inputs.nif") }}</Label>
                  <Input
                    class="tour-target-input-nif"
                    v-model="newCustomer.vat"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.nif')"
                  />
                </div>

                <div
                  class="flex flex-col gap-2"
                  v-if="newCustomer.contactType !== CustomerType.Company"
                >
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.maritalStatus.label")
                  }}</Label>
                  <Select v-model="newCustomer.maritalStatus" >
                    <SelectTrigger class="tour-target-select-marital-status">
                      <SelectValue
                        :placeholder="
                          $t(
                            'cpcv.contacts.modals.form.inputs.selectMaritalStatus'
                          )
                        "
                      />
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
                    <Label class="mt-2">{{
                      $t("cpcv.contacts.modals.form.inputs.marriedUnderRegime")
                    }}</Label>

                    <Select v-model="newCustomer.marriedUnderRegime">
                      <SelectTrigger>
                        <SelectValue
                          :placeholder="
                            $t(
                              'cpcv.contacts.modals.form.inputs.marriedUnderRegime'
                            )
                          "
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="regime in marriedUnderRegime"
                            :key="regime.value"
                            :value="regime.value"
                          >
                            {{ $t(regime.label) }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </template>
                </div>
              </div>

              <!-- Endereço -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.country")
                  }}</Label>
                  <Input
                    class="tour-target-input-country"
                    v-model="newCustomer.country"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.country')"
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.district")
                  }}</Label>
                  <Input
                    class="tour-target-input-district"
                    v-model="newCustomer.district"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.district')"
                  />
                </div>

                <div>
                  <Label>{{ $t("cpcv.contacts.modals.form.inputs.city") }}</Label>
                  <Input
                    class="tour-target-input-city"
                    v-model="newCustomer.city"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.city')"
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.neighborhood")
                  }}</Label>
                  <Input
                    class="tour-target-input-neighborhood"
                    v-model="newCustomer.neighborhood"
                    :placeholder="
                      $t('cpcv.contacts.modals.form.inputs.neighborhood')
                    "
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.address")
                  }}</Label>
                  <Input
                    class="tour-target-input-address"
                    v-model="newCustomer.address"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.address')"
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.zipCode")
                  }}</Label>
                  <Input
                    class="tour-target-input-zip-code"
                    v-model="newCustomer.zipCode"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.zipCode')"
                  />
                </div>
              </div>

              <!-- Documento de Identificação -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 3">
                <div>
                  <Label>Tipo de Documento</Label>
                  <Select v-model="newCustomer.identityType">
                    <SelectTrigger class="tour-target-select-identity-type">
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="citizenCard"
                          >Cartão de Cidadão</SelectItem
                        >
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
                    v-model="newCustomer.identityNumber"
                    placeholder="Introduza o número do documento"
                  />
                </div>

                <div>
                  <Label>Data de Emissão</Label>
                  <Input
                    class="tour-target-input-identity-expiration-date"
                    type="date"
                    v-model="newCustomer.identityExpirationDate"
                    placeholder="Introduza a data de emissão"
                  />
                </div>

                <div>
                  <Label>Local de Emissão</Label>
                  <Input
                    class="tour-target-input-identity-issuer"
                    v-model="newCustomer.identityIssuer"
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
                    v-model="newCustomer.companyRegistration"
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
                    v-model="newCustomer.companyCode"
                    :placeholder="
                      $t('cpcv.contacts.modals.form.inputs.permanentCertificate')
                    "
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.codeRCBE")
                  }}</Label>
                  <Input
                    class="tour-target-input-company-rcbe-code"
                    v-model="newCustomer.companyRCBECode"
                    :placeholder="$t('cpcv.contacts.modals.form.inputs.codeRCBE')"
                  />
                </div>

                <div>
                  <Label>{{
                    $t("cpcv.contacts.modals.form.inputs.socialCapital")
                  }}</Label>
                  <Input
                    class="tour-target-input-company-social-capital"
                    v-model="newCustomer.companySocialCapital"
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
                  @click="selectedType = false"
                  class="mt-4"
                  v-if="currentStep === 1"
                >
                  {{ $t("shared.back") }}
                </Button>
                <Button @click="handleNextClick(nextStep)" class="mt-4">
                  {{ buttonNextLabel }}
                </Button>
              </div>
            </div>
          </Stepper>
        </div>
      </CardContent>
    </Card>

    <!--<ContactCreateTour @step-next="handleStepNext" @tour-start="handleTourStart" @tour-complete="handleTourComplete" />-->
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
  colorMode: "light",
});

import {
  Card,
  CardContent,
} from "@/components/ui/card";
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
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
const { $t } = useNuxtApp();
import { Check, Circle, Dot } from "lucide-vue-next";
import { CustomerType, MaritalStatus } from "./contacts.config";
import type { Contact } from "./_contacts";
import ContactCreateTour from './ContactCreateTour.vue';

const selectedType = ref(false);
const newCustomer = ref<Contact>({
  name: "",
  vat: "",
  maritalStatus: MaritalStatus.Single,
  marriedUnderRegime: "",
  identityType: "",
  identityNumber: "",
  identityExpirationDate: "",
  identityIssuer: "",
  country: "",
  address: "",
  neighborhood: "",
  state: "",
  city: "",
  zipCode: "",
  companyRegistration: "",
  companyCode: "",
  companyRCBECode: "",
  companySocialCapital: "",
  contactType: CustomerType.Individual,
});

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
      title: $t(
        `cpcv.contacts.modals.form.steps.1.title.${newCustomer.value.contactType}`
      ),
      description: $t(
        `cpcv.contacts.modals.form.steps.1.description.${newCustomer.value.contactType}`
      ),
    },
    {
      step: 2,
      title: $t(
        `cpcv.contacts.modals.form.steps.2.title.${newCustomer.value.contactType}`
      ),
      description: $t(
        `cpcv.contacts.modals.form.steps.2.description.${newCustomer.value.contactType}`
      ),
    },
    {
      step: 3,
      title: $t(
        `cpcv.contacts.modals.form.steps.3.title.${newCustomer.value.contactType}`
      ),
      description: $t(
        `cpcv.contacts.modals.form.steps.3.description.${newCustomer.value.contactType}`
      ),
    },
  ];

  if (newCustomer.value.contactType === CustomerType.Individual) {
    stepsList.value = stepsList.value.filter((step) => step.step !== 4);
  } else if (stepsList.value.filter((step) => step.step === 4).length === 0) {
    stepsList.value.push(stepCompany);
  }

  return stepsList.value;
});

const currentStep = ref(1);
const maritalStatus = ref([
  {
    value: MaritalStatus.Single,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.single",
  },
  {
    value: MaritalStatus.Married,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.married",
  },
  {
    value: MaritalStatus.Divorced,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.divorced",
  },
  {
    value: MaritalStatus.Widowed,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.widowed",
  },
]);

const marriedUnderRegime = ref([
  {
    value: MaritalStatus.CommunityOfGoods,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.communityOfGoods",
  },
  {
    value: MaritalStatus.SeparationOfGoods,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.separationOfGoods",
  },
  {
    value: MaritalStatus.CommunityOfAcquests,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.communityOfAcquests",
  },
]);

const setNewCustomerType = (type: CustomerType) => {
  newCustomer.value.contactType = type;
  selectedType.value = true;
};

const handleNextClick = async (func: Function) => {
  if (currentStep.value === steps.value[steps.value.length - 1].step) {
    const response = await $fetch<{ success?: boolean }>(
      "/api/contacts/create",
      {
        method: "POST",
        body: newCustomer.value,
      }
    ).catch((err) => err.response);

    if (response.success) {
      navigateTo("/contacts");
      toast({
        title: "Contato criado!",
        description: "O contato foi criado com sucesso",
        variant: "success",
      });
    }

    return;
  }

  func();
};

const handleBackClick = (func: Function) => {
  if (currentStep.value === 1) {
    selectedType.value = false;
    return;
  }

  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value[steps.value.length - 1].step
    ? $t("shared.save")
    : $t("shared.next");
});

import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

const router = useRouter();

const handleStepNext = (step: number) => {
  selectedType.value = true;
  newCustomer.value.contactType = CustomerType.Individual;
  console.log(step);
  if(step === 3) {
    currentStep.value = 2
  }else if(step === 9) {
    currentStep.value = 4
  }
};

const handleTourStart = () => {
  console.log("tour started");
  selectedType.value = false;
  currentStep.value = 1;
  newCustomer.value.contactType = undefined;
};

const handleTourComplete = () => {
  selectedType.value = false;
  currentStep.value = 1;
};
</script>
