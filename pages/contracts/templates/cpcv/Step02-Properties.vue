<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="property-select space-y-2">
      <Label class="text-sm font-medium text-gray-700">Imóvel</Label>
      <Select v-model="selectedPropertyId">
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
              :value="property?.id?.toString()"
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
                  <span class="font-medium">[#{{ property.id }}]</span>
                  <span class="text-sm text-gray-500">
                    {{ property.city }}, {{ property.neighborhood }},
                    {{ property.address }}, {{ property.number }}
                  </span>
                </div>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Property } from "@/types/properties";
defineProps<{
  properties: Property[];
}>();

const selectedPropertyId = ref<string>("-1");

const emit = defineEmits<{
  onSelectProperty: [number];
}>();

watch(selectedPropertyId, (newValue) => {
  emit("onSelectProperty", Number(newValue));
});
</script>
