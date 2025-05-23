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

                  <Select v-model="newProperty.destination">
                    <SelectTrigger
                      class="w-full bg-white border-gray-200 hover:border-gray-300"
                    >
                      <SelectValue
                        placeholder="Selecione o destino do imóvel"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Residencial">Residencial</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <!-- Localização -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 2">
                <div>
                  <Label>País</Label>
                  <Popover v-model:open="openSearchCountry">
                    <PopoverTrigger
                      class="text-sm w-full text-left border border-gray-200 px-4 py-2 rounded-md bg-white hover:border-gray-300"
                    >
                      {{ newProperty.country || "Selecione ou escreva o país" }}
                    </PopoverTrigger>

                    <PopoverContent class="w-full p-0">
                      <Command v-model="newProperty.country">
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
                              v-for="country in countries"
                              :key="country"
                              :value="country"
                              @select="openSearchCountry = false"
                            >
                              <Check
                                :class="
                                  cn(
                                    'mr-2 h-4 w-4',
                                    newProperty.district === country
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )
                                "
                              />
                              {{ country }}
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Distrito</Label>
                  <Popover v-model:open="openSearchDistrict">
                    <PopoverTrigger as-child>
                      <Button
                        variant="outline"
                        :aria-expanded="openSearchDistrict"
                        class="w-full justify-between text-sm font-normal"
                      >
                        {{
                          newProperty.district ||
                          "Selecione ou escreva o distrito"
                        }}
                        <ChevronsUpDown
                          class="ml-2 h-4 w-4 shrink-0 opacity-50"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-full p-0">
                      <Command v-model="newProperty.district">
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
                                    newProperty.district === district.value
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
                  <Label>Cidade</Label>
                  <Input
                    v-model="newProperty.city"
                    placeholder="Digite a cidade"
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
                  <Label>Morada</Label>
                  <Input
                    v-model="newProperty.address"
                    placeholder="Digite a morada"
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
                  <Label>Número da Licença de Utilização</Label>
                  <Input
                    v-model="newProperty.luNumber"
                    placeholder="Digite o número LU"
                  />
                </div>

                <div>
                  <Label> Data da Licença de Utilização</Label>
                  <Input
                    type="date"
                    v-model="newProperty.luDate"
                    placeholder="Digite a data LU"
                  />
                </div>

                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <Label for="luIssuer" class="flex gap-1"
                          >Emissor da Licença de Utilização
                          <Info class="size-4 text-black/50" />
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        Entidade que emitiu a licença (ex: Câmara Municipal).
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Popover v-model:open="openSearchLuIssuer">
                    <PopoverTrigger
                      class="text-sm w-full text-left border border-gray-200 px-4 py-2 rounded-md bg-white hover:border-gray-300"
                    >
                      {{
                        newProperty.luIssuer ||
                        "Selecione o emissor da licença de utilização"
                      }}
                    </PopoverTrigger>
                    <PopoverContent class="w-full p-0">
                      <Command v-model="newProperty.luIssuer">
                        <CommandInput
                          placeholder="Pesquisar entidade..."
                          @keydown.enter="handleLuIssuerInput"
                        />
                        <CommandEmpty>
                          Nenhuma entidade encontrada.
                          <br />
                          Pressione <b>enter</b> para salvar a entidade.
                        </CommandEmpty>

                        <CommandGroup>
                          <CommandItem
                            value="Câmara Municipal"
                            @select="openSearchLuIssuer = false"
                          >
                            Câmara Municipal
                          </CommandItem>
                          <CommandItem
                            value="IMT"
                            @select="openSearchLuIssuer = false"
                          >
                            IMT
                          </CommandItem>
                          <CommandItem
                            value="Outros"
                            @select="openSearchLuIssuer = false"
                          >
                            Outros
                          </CommandItem>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Letra do Certificado Energético</Label>
                  <Select v-model="newProperty.ecLetter">
                    <SelectTrigger>
                      <SelectValue
                        :placeholder="
                          newProperty.ecLetter || 'Selecione a letra'
                        "
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="letter in certifiedEnergyLetters"
                        :key="letter"
                        :value="letter"
                      >
                        {{ letter }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nº do Certificado Energético</Label>
                  <Input
                    v-model="newProperty.ecNumber"
                    placeholder="Digite o número do certificado energético"
                  />
                </div>

                <div>
                  <Label>Validade do Certificado Energético</Label>
                  <Input
                    type="date"
                    v-model="newProperty.ecValidUntil"
                    placeholder="Digite a validade do certificado energético"
                  />
                </div>
              </div>

              <!-- Encargos -->
              <div class="flex flex-col flex-1 gap-4" v-if="currentStep === 4">
                <div>
                  <Label>Tipo de Encargo</Label>
                  <Select v-model="newProperty.chargesType">
                    <SelectTrigger>
                      <SelectValue
                        :placeholder="
                          newProperty.chargesType || 'Selecione o tipo'
                        "
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="type in chargesTypes"
                        :key="type"
                        :value="type"
                      >
                        {{ type }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
import { Check, Circle, Dot, Info } from "lucide-vue-next";
import type { Property } from "./_property";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

import { cn } from "@/lib/utils";

const router = useRouter();
const { toast } = useToast();

const currentStep = ref(1);
const newProperty = ref<Partial<Property>>({
  link: "",
  price: 0,
  country: "",
  district: "",
  city: "",
  neighborhood: "",
  address: "",
  postalCode: "",
  fraction: "",
  floor: "",
  destination: "",
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
    description: "Fração, andar e destino",
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

const certifiedEnergyLetters = ["A", "B", "C", "D", "E"];

const chargesTypes = ["Hipoteca", "Penhora", "Usufruto", "Outro"];

const openSearchDistrict = ref(false);
const openSearchCountry = ref(false);
const openSearchLuIssuer = ref(false);
const handleDistrictInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    newProperty.value.district = (event.target as HTMLInputElement).value;
    openSearchDistrict.value = false;
  }
};

const handleCountryInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    newProperty.value.country = (event.target as HTMLInputElement).value;
    openSearchCountry.value = false;
  }
};

const handleLuIssuerInput = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    newProperty.value.luIssuer = (event.target as HTMLInputElement).value;
    openSearchLuIssuer.value = false;
  }
};
</script>
