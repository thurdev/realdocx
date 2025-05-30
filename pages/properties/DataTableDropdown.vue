<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">{{ $t("shared.actions.open") }}</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ $t("shared.actions.title") }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="isEditDialogOpen = true">
        {{ $t("shared.actions.edit") }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDelete">
        {{ $t("shared.actions.delete") }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <DialogsEditProperty
    :property="row"
    :is-open="isEditDialogOpen"
    @update:open="handleEditDialogClosed"
    @property="handlePropertyUpdated"
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
import type { Property } from "./_property";
import { useToast } from "@/components/ui/toast/use-toast";

const router = useRouter();
const { $t } = useNuxtApp();
const { toast } = useToast();

const props = defineProps<{
  row: Property;
  updateTable: () => Promise<void>;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "done", property: Partial<Property & { id: number }>): void;
}>();

const handleDelete = async () => {
  try {
    await $fetch(`/api/properties/delete`, {
      method: "POST",
      body: {
        id: props.row.id,
      },
    });

    toast({
      title: $t("shared.success"),
      description: $t("properties.deleted"),
      variant: "success",
    });

    await props.updateTable();

    emit("delete");
  } catch (error) {
    console.error("Error deleting property:", error);
    toast({
      title: $t("shared.error"),
      description: $t("properties.deleteError"),
      variant: "errors",
    });
  }
};

const isEditDialogOpen = ref(false);
const handleEditDialogClosed = (isOpen: boolean) => {
  isEditDialogOpen.value = isOpen;
};

const handlePropertyUpdated = (
  property: Partial<Property & { id: number }>
) => {
  // close the dialog
  isEditDialogOpen.value = false;
  // Emit an event to notify the parent component that the contact has been updated
  emit("done", property);
};
</script>
