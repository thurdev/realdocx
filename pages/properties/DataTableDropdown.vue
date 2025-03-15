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
      <DropdownMenuItem @click="router.push(`/properties/${row.id}/edit`)">
        {{ $t("shared.actions.edit") }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDelete">
        {{ $t("shared.actions.delete") }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
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
}>();

const emit = defineEmits<{
  (e: "delete"): void;
}>();

const handleDelete = async () => {
  try {
    await $fetch(`/api/properties/${props.row.id}`, {
      method: "DELETE",
    });
    
    toast({
      title: $t("shared.success"),
      description: $t("properties.deleted"),
    });
    
    emit("delete");
  } catch (error) {
    console.error("Error deleting property:", error);
    toast({
      title: $t("shared.error"),
      description: $t("properties.deleteError"),
      variant: "destructive",
    });
  }
};
</script>
