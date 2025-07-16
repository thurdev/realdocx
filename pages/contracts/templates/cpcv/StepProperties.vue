<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="property-select space-y-2">
      <Label class="text-sm font-medium text-gray-700">Imóvel</Label>
      <Popover v-model:open="open">
        <PopoverTrigger as-child class="pb-4 pt-4">
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="open"
            class="w-full justify-between bg-white border-gray-200 hover:border-gray-300 h-12"
          >
            <div class="flex items-center gap-4" v-if="selectedProperty">
              <img
                :src="
                  selectedProperty.image ||
                  'https://saterdesign.com/cdn/shop/products/property-placeholder_a9ec7710-1f1e-4654-9893-28c34e3b6399.jpg?v=1500393334'
                "
                class="w-8 h-8 rounded-lg object-cover"
                alt="Property image"
              />
              <div class="flex flex-col text-left">
                <span class="font-medium">
                  #{{ selectedProperty.id }} -
                  {{ selectedProperty.propertyType }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ selectedProperty.city }},
                  {{ selectedProperty.neighborhood }},
                  {{ selectedProperty.address }}, {{ selectedProperty.number }}
                </span>
                <span class="text-sm text-gray-500">
                  {{ selectedProperty.description }}
                </span>
              </div>
            </div>
            <span v-else>Selecione o Imóvel</span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style="width: var(--radix-popover-trigger-width)"
          class="w-full p-0"
        >
          <Command>
            <CommandInput placeholder="Pesquisar imóvel..." />
            <CommandEmpty>Nenhum imóvel encontrado.</CommandEmpty>
            <CommandList>
              <CommandGroup v-if="properties.length > 0">
                <CommandItem
                  v-for="property in properties"
                  :key="property.id"
                  :value="property.id.toString()"
                  @select="handleSelect(property)"
                >
                  <div class="flex items-center gap-4">
                    <img
                      :src="
                        property.image ||
                        'https://saterdesign.com/cdn/shop/products/property-placeholder_a9ec7710-1f1e-4654-9893-28c34e3b6399.jpg?v=1500393334'
                      "
                      class="w-8 h-8 rounded-lg object-cover"
                      alt="Property image"
                    />
                    <div class="flex flex-col">
                      <span class="font-medium"
                        >#{{ property.id }} -
                        {{ property.propertyType }}
                      </span>

                      <span class="text-sm text-gray-500">
                        {{ property.city }}, {{ property.neighborhood }},
                        {{ property.address }}, {{ property.number }}
                      </span>
                      <span class="text-sm text-gray-500">
                        {{ property.description }}
                      </span>
                    </div>
                  </div>
                </CommandItem>

                <!-- Opção Criar Propriedade -->
                <CommandItem
                  value="create-property"
                  @select="handleCreateProperty"
                >
                  <div class="flex items-center gap-4 w-full">
                    <div
                      class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <Plus class="w-4 h-4 text-primary" />
                    </div>
                    <div class="flex flex-col flex-1">
                      <span class="font-medium text-primary"
                        >Criar Propriedade</span
                      >
                      <span class="text-sm text-gray-500"
                        >Adicionar novo imóvel</span
                      >
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
              <div v-else class="p-4 text-center">
                <p class="text-gray-500 mb-2">Nenhum imóvel cadastrado</p>
                <button
                  @click="handleCreateProperty"
                  class="text-primary hover:underline font-medium"
                >
                  Clique aqui para adicionar um imóvel
                </button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <!-- Modal para criar propriedade -->
    <Dialog v-model:open="showCreatePropertyModal">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Propriedade</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo imóvel
          </DialogDescription>
        </DialogHeader>
        <CreateProperty
          @onPropertyCreate="handlePropertyCreated"
          successMessage="Propriedade criada com sucesso!"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Property } from "@/types/properties";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronsUpDown, Plus } from "lucide-vue-next";
import CreateProperty from "@/components/forms/CreateProperty.vue";

const props = defineProps<{
  properties: Property[];
}>();

const open = ref(false);
const selectedProperty = ref<Property | null>(null);
const showCreatePropertyModal = ref(false);

const emit = defineEmits<{
  onSelectProperty: [number];
  onRefreshProperties: [];
}>();

const handleSelect = (property: Property) => {
  selectedProperty.value = property;
  emit("onSelectProperty", property.id);
  open.value = false;
};

const handleCreateProperty = () => {
  showCreatePropertyModal.value = true;
  open.value = false;
};

const handlePropertyCreated = async (
  newProperty: Partial<Property & { id: number }>
) => {
  // Fecha o modal
  showCreatePropertyModal.value = false;

  // Solicita refresh da lista de propriedades
  emit("onRefreshProperties");
};
</script>
