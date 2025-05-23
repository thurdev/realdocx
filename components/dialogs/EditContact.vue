<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Editar Contato: {{ contact?.name }}</DialogTitle>
      </DialogHeader>
      <FormsCreateContact
        :contact="contact"
        :successMessage="$t('contacts.editContactSuccess')"
        @onContactCreate="handleContactUpdated"
      />
      <DialogFooter class="mt-4">
        <Button @click="$emit('update:open', false)">Fechar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Contact } from "~/pages/contacts/_contacts";

const props = defineProps<{
  isOpen: boolean;
  contact: Contact | null;
}>();

const emit = defineEmits<{
  "update:open": [boolean];
  contact: [Contact];
}>();

const handleContactUpdated = (contact: Contact) => {
  // Emit an event to notify the parent component that the contact has been updated
  emit("update:open", false);
  emit("contact", contact);
};
</script>
