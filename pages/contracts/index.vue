<template>
  <div class="container mx-auto py-8 px-4">
    <div class="flex flex-col gap-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">{{ $t('contracts.title') }}</h1>
        <NuxtLink to="/contracts/create">
          <Button variant="default">
            <i class="fa-light fa-plus mr-2" />
            {{ $t('contracts.create') }}
          </Button>
        </NuxtLink>
      </div>

      <Card class="w-full">
        <CardContent class="p-6">
          <div v-if="contracts.length === 0" class="text-center py-8">
            <p class="text-gray-500 mb-4">{{ $t('contracts.empty') }}</p>
            <NuxtLink to="/contracts/create">
              <Button variant="default">
                <i class="fa-light fa-plus mr-2" />
                {{ $t('contracts.createFirst') }}
              </Button>
            </NuxtLink>
          </div>
          <div v-else>
            <DataTable :columns="columns" :data="contracts" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
  colorMode: "light",
});

import type { Contract } from "./_contract";
import { columns } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable/DataTable.vue";

const contracts = ref<Contract[]>([]);
const route = useRoute();

const fetchContracts = async () => {
  contracts.value = await $fetch<Contract[]>("/api/contracts");
};

onMounted(async () => {
  await fetchContracts();
});

watch(() => route.query.deleted, async () => {
  if (route.query.deleted) {
    await fetchContracts();
  }
});
</script>
