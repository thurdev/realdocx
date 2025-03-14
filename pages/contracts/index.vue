<template>
  <div class="flex flex-col gap-8">
    <Card class="w-full flex-1">
      <CardHeader>
        <CardTitle class="flex justify-between items-center">
          <h1>Lista de Contractos</h1>
          <NuxtLink to="/contracts/create">
          <Button variant="default">
            Criar Contrato
          </Button>
          </NuxtLink>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="contracts.length === 0" class="text-center py-8">
          <p class="text-gray-500 mb-4">Não existem Contractos criados.</p>
          <NuxtLink to="/contracts/create">
          <Button variant="default">
            Criar Primeiro Contrato
          </Button>
          </NuxtLink>
        </div>
        <div v-else>
          <DataTable :columns="columns" :data="contracts" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import type { Contract } from "./_contract";
import { columns } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable/DataTable.vue";

const router = useRouter();
const contracts = ref<Contract[]>([]);

onMounted(async () => {
  contracts.value = await $fetch<Contract[]>("/api/contracts");
  
  // If there are no contracts, redirect to create page
  if (contracts.value.length === 0) {
    router.push('/contracts/create');
  }
});
</script>
