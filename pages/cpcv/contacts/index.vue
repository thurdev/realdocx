<template>
  <div>
    <Card class="">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de contatos</h1>
          <Button @click="dialogCreateContactOption = true"
            >Adicionar Contato</Button
          >
        </CardTitle>
      </CardHeader>
      <CardContent>
        <!-- <Input class="max-w-[256px]" /> -->

        <DataTable :columns="columns" :data="contacts" />
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
                  v-model="newCustomer.name"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.name')"
                />
              </div>

              <div>
                <Label>{{ $t("cpcv.contacts.modals.form.inputs.nif") }}</Label>
                <Input
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
                <Select v-model="newCustomer.maritalStatus">
                  <SelectTrigger>
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
                  v-model="newCustomer.country"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.country')"
                />
              </div>

              <div>
                <Label>{{
                  $t("cpcv.contacts.modals.form.inputs.district")
                }}</Label>
                <Input
                  v-model="newCustomer.district"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.district')"
                />
              </div>

              <div>
                <Label>{{ $t("cpcv.contacts.modals.form.inputs.city") }}</Label>
                <Input
                  v-model="newCustomer.city"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.city')"
                />
              </div>

              <div>
                <Label>{{
                  $t("cpcv.contacts.modals.form.inputs.neighborhood")
                }}</Label>
                <Input
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
                  v-model="newCustomer.address"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.address')"
                />
              </div>

              <div>
                <Label>{{
                  $t("cpcv.contacts.modals.form.inputs.zipCode")
                }}</Label>
                <Input
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
                  <SelectTrigger>
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
                  v-model="newCustomer.identityNumber"
                  placeholder="Introduza o número do documento"
                />
              </div>

              <div>
                <Label>Data de Emissão</Label>
                <Input
                  type="date"
                  v-model="newCustomer.identityExpirationDate"
                  placeholder="Introduza a data de emissão"
                />
              </div>

              <div>
                <Label>Local de Emissão</Label>
                <Input
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
                  v-model="newCustomer.companyRCBECode"
                  :placeholder="$t('cpcv.contacts.modals.form.inputs.codeRCBE')"
                />
              </div>

              <div>
                <Label>{{
                  $t("cpcv.contacts.modals.form.inputs.socialCapital")
                }}</Label>
                <Input
                  v-model="newCustomer.companySocialCapital"
                  :placeholder="
                    $t('cpcv.contacts.modals.form.inputs.socialCapital')
                  "
                />
              </div>
            </div>

            <div class="flex w-full h-full justify-end self-end">
              <Button
                variant="ghost"
                @click="handleBackClick(prevStep)"
                class="mt-4"
                v-if="currentStep > 1"
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
    </DialogContent>
  </Dialog>

  <Dialog v-model:open="dialogCreateContactOption">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ $t("cpcv.contacts.modals.contactType") }}</DialogTitle>
        <DialogDescription>
          {{ $t("cpcv.contacts.modals.contactTypeDescription") }}
        </DialogDescription>

        <div class="flex gap-2">
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
const { $t } = useNuxtApp();
import { Check, Circle, Dot } from "lucide-vue-next";
import { CustomerType, MaritalStatus } from "./contacts.config";
import type { Contact } from "./_contacts";

const contacts = ref<Contact[]>([]);

const newCustomer = ref<Contact>({
  // database contact
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
const dialogCreate = ref(false);
const dialogCreateContactOption = ref(false);
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
  dialogCreateContactOption.value = false;

  dialogCreate.value = true;
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
      dialogCreate.value = false;
      contacts.value = [
        ...contacts.value,
        { ...newCustomer.value, id: contacts.value.length + 1 },
      ];
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
    dialogCreate.value = false;
    return;
  }

  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value[steps.value.length - 1].step
    ? $t("shared.save")
    : $t("shared.next");
});

import { onMounted, ref } from "vue";
import { columns } from "./columns";
import DataTable from "@/components/dataTable/DataTable.vue";
import { useRoute } from "vue-router";

import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
});

const $route = useRoute();

watch(
  () => $route.query.deleted,
  (deleted) => {
    const id = Number(deleted);
    if (id && id > 0) {
      contacts.value = contacts.value.filter((contact) => contact.id !== id);
      navigateTo("/cpcv/contacts");

      toast({
        title: "Contato apagado",
        description: "O contato foi apagado com sucesso",
        variant: "success",
      });
    }
  }
);
</script>
