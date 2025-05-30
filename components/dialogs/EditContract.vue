<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Contrato</DialogTitle>
      </DialogHeader>
      <!-- FORM EDIT CONTRACT -->
      <DialogFooter>
        <Button @click="handleContractEdited">Salvar</Button>
      </DialogFooter>
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
import type { Contract } from "~/pages/contracts/_contract";

const props = defineProps<{
  isOpen: boolean;
  contract: Partial<Contract>;
}>();

const localContract = ref<Partial<Contract>>({});

watch(
  () => props.contract,
  () => {
    localContract.value = { ...props.contract };
  },
  { deep: true, immediate: true }
);

const emit = defineEmits<{
  "update:open": [boolean];
  contract: [Partial<Contract>];
}>();

const handleContractEdited = () => {
  // Emit an event to notify the parent component that the contact has been updated
  emit("update:open", false);
  emit("contract", localContract.value);
};
</script>
