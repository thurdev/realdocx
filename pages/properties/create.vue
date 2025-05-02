<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center justify-center gap-4">
        <div>
          <Button
            variant="ghost"
            class="rounded-full w-12 h-12 hover:shadow hover:bg-white text-xl"
            @click="router.push('/properties')"
          >
            <i class="fa-light fa-arrow-left"></i>
          </Button>
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Criar Propriedade</h2>
          <p class="text-muted-foreground">Preencha os dados da propriedade</p>
        </div>
      </div>
      <div></div>
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
              <!-- Informações Básicas -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 1">
                <div>
                  <Label>Fração</Label>
                  <Input
                    v-model="newProperty.fraction"
                    placeholder="Digite a fração"
                  />
                </div>

                <div>
                  <Label>Andar</Label>
                  <Input
                    v-model="newProperty.floor"
                    placeholder="Digite o andar"
                  />
                </div>

                <div>
                  <Label>Destino</Label>
                  <Input
                    v-model="newProperty.destination"
                    placeholder="Digite o destino"
                  />
                </div>
              </div>

              <!-- Localização -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
                <div>
                  <Label>Distrito</Label>
                  <Input
                    v-model="newProperty.district"
                    placeholder="Digite o distrito"
                  />
                </div>

                <div>
                  <Label>Bairro</Label>
                  <Input
                    v-model="newProperty.neighborhood"
                    placeholder="Digite o bairro"
                  />
                </div>

                <div>
                  <Label>Endereço</Label>
                  <Input
                    v-model="newProperty.address"
                    placeholder="Digite o endereço"
                  />
                </div>

                <div>
                  <Label>Número</Label>
                  <Input
                    v-model="newProperty.number"
                    placeholder="Digite o número"
                  />
                </div>

                <div>
                  <Label>Cidade</Label>
                  <Input
                    v-model="newProperty.city"
                    placeholder="Digite a cidade"
                  />
                </div>

                <div>
                  <Label>Código Postal</Label>
                  <Input
                    v-model="newProperty.postalCode"
                    placeholder="Digite o código postal"
                  />
                </div>
              </div>

              <!-- Documentação -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 3">
                <div>
                  <Label>Registro de Matriz</Label>
                  <Input
                    v-model="newProperty.matrixRegistration"
                    placeholder="Digite o registro de matriz"
                  />
                </div>

                <div>
                  <Label>Número da Descrição do Edifício</Label>
                  <Input
                    v-model="newProperty.buildingDescriptionNumber"
                    placeholder="Digite o número da descrição"
                  />
                </div>

                <div>
                  <Label>Registro da Descrição do Edifício</Label>
                  <Input
                    v-model="newProperty.buildingDescriptionRegistry"
                    placeholder="Digite o registro da descrição"
                  />
                </div>

                <div>
                  <Label>Número LU</Label>
                  <Input
                    v-model="newProperty.luNumber"
                    placeholder="Digite o número LU"
                  />
                </div>

                <div>
                  <Label>Data LU</Label>
                  <Input
                    type="date"
                    v-model="newProperty.luDate"
                    placeholder="Digite a data LU"
                  />
                </div>

                <div>
                  <Label>Emissor LU</Label>
                  <Input
                    v-model="newProperty.luIssuer"
                    placeholder="Digite o emissor LU"
                  />
                </div>

                <div>
                  <Label>Letra EC</Label>
                  <Input
                    v-model="newProperty.ecLetter"
                    placeholder="Digite a letra EC"
                  />
                </div>

                <div>
                  <Label>Número EC</Label>
                  <Input
                    v-model="newProperty.ecNumber"
                    placeholder="Digite o número EC"
                  />
                </div>

                <div>
                  <Label>Validade EC</Label>
                  <Input
                    type="date"
                    v-model="newProperty.ecValidUntil"
                    placeholder="Digite a validade EC"
                  />
                </div>
              </div>

              <!-- Encargos -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 4">
                <div>
                  <Label>Tipo de Encargo</Label>
                  <Input
                    v-model="newProperty.chargesType"
                    placeholder="Digite o tipo de encargo"
                  />
                </div>

                <div>
                  <Label>Banco</Label>
                  <Input
                    v-model="newProperty.chargesBank"
                    placeholder="Digite o banco"
                  />
                </div>

                <div>
                  <Label>AP</Label>
                  <Input
                    v-model="newProperty.chargesAP"
                    placeholder="Digite o AP"
                  />
                </div>

                <div>
                  <Label>Data</Label>
                  <Input
                    type="date"
                    v-model="newProperty.chargesDate"
                    placeholder="Digite a data"
                  />
                </div>
              </div>

              <div
                class="flex justify-end self-end gap-2 fixed right-[1rem] bottom-[1rem] p-2 rounded"
              >
                <Button
                  variant="outline"
                  @click="handleBackClick(prevStep)"
                  v-if="currentStep > 1"
                >
                  Voltar
                </Button>
                <Button @click="handleNextClick(nextStep)">
                  {{ buttonNextLabel }}
                </Button>
              </div>
            </div>
          </Stepper>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
  colorMode: "light",
});

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Check, Circle, Dot } from "lucide-vue-next";
import type { Property } from "./_property";
import { useToast } from "@/components/ui/toast/use-toast";

const router = useRouter();
const { toast } = useToast();

const currentStep = ref(1);
const newProperty = ref<Partial<Property>>({
  price: 0,
  fraction: "",
  floor: "",
  destination: "",
  district: "",
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

const steps = ref([
  {
    step: 1,
    title: "1. Informações Básicas",
    description: "Preço, fração, andar e destino",
  },
  {
    step: 2,
    title: "2. Localização",
    description: "Endereço completo da propriedade",
  },
  {
    step: 3,
    title: "3. Documentação",
    description: "Documentos e registros",
  },
  {
    step: 4,
    title: "4. Encargos",
    description: "Informações sobre encargos",
  },
]);

const handleNextClick = async (func: Function) => {
  if (currentStep.value === steps.value.length) {
    const response = await $fetch<{ success?: boolean }>("/api/properties", {
      method: "POST",
      body: newProperty.value,
    }).catch((err) => err.response);

    if (response.success) {
      navigateTo("/properties");
      toast({
        title: "Propriedade criada!",
        description: "A propriedade foi criada com sucesso",
        variant: "success",
      });
    }

    return;
  }

  func();
};

const handleBackClick = (func: Function) => {
  func();
};

const buttonNextLabel = computed(() => {
  return currentStep.value === steps.value.length ? "Salvar" : "Próximo";
});
</script>
