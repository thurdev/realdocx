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
      <DropdownMenuItem @click="handleViewContract">Visualizar</DropdownMenuItem>
      <DropdownMenuItem @click="handleDownloadContract">Download</DropdownMenuItem>
      <DropdownMenuItem @click="handleDeleteContract">Apagar</DropdownMenuItem>
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
import type { Contract } from "./_contract";

const props = defineProps<{
  contract: Contract;
}>();

const handleViewContract = () => {
  // TODO: Implement view action
};

const handleDownloadContract = () => {
  // TODO: Implement download action
};

const handleDeleteContract = async () => {
  await $fetch("/api/contracts/delete", {
    method: "POST",
    body: props.contract,
  });
  navigateTo("/contracts?deleted=" + props.contract.id);
};
</script> 