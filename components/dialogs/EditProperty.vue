<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Imóvel: {{ property?.address }}</DialogTitle>
      </DialogHeader>
      <FormsCreateProperty
        :property="property"
        :successMessage="$t('properties.editPropertySuccess')"
        @onPropertyCreate="handlePropertyUpdated"
      />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Property } from "~/pages/properties/_property";

const props = defineProps<{
  isOpen: boolean;
  property?: Property;
}>();

const emit = defineEmits<{
  "update:open": [boolean];
  property: [Partial<Property & { id: number }>];
}>();

const handlePropertyUpdated = (
  property: Partial<Property & { id: number }>
) => {
  // Emit an event to notify the parent component that the contact has been updated
  emit("update:open", false);
  emit("property", property);
};
</script>
