<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Ações</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="isEditDialogOpen = true"
        >Editar</DropdownMenuItem
      >
      <DropdownMenuItem @click="handleDeleteContact">Apagar</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <DialogsEditContact
    :contact="contact"
    :is-open="isEditDialogOpen"
    @update:open="handleEditDialogClosed"
    @contact="handleContactUpdated"
  />
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-vue-next";
import type { Contact } from "./_contacts";

const props = defineProps<{
  contact: Contact;
}>();

const emit = defineEmits<{
  done: [Contact];
}>();

const isEditDialogOpen = ref(false);

const handleDeleteContact = async () => {
  await $fetch("/api/contacts/delete", {
    method: "POST",
    body: props.contact,
  });
  navigateTo("/contacts?deleted=" + props.contact.id);
};

const handleEditDialogClosed = (isOpen: boolean) => {
  isEditDialogOpen.value = isOpen;
};

const handleContactUpdated = (contact: Contact) => {
  // close the dialog
  isEditDialogOpen.value = false;
  // Emit an event to notify the parent component that the contact has been updated
  emit("done", contact);
};
</script>
