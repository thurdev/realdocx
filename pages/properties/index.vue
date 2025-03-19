<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          {{ $t("properties.title") }}
        </h2>
        <p class="text-muted-foreground">
          {{ $t("properties.description") }}
        </p>
      </div>
      <div>
        <Button @click="router.push('/properties/create')">
          <i class="fa-light fa-plus mr-2"></i>
          {{ $t("properties.create") }}
        </Button>
      </div>
    </div>

    <Card>
      <CardContent>
        <DataTable
          class="mt-6"
          :columns="columns"
          :data="properties"
          :loading="loading"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "authenticated",
  middleware: "authenticated",
  colorMode: "light",
});

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable/DataTable.vue";
import DataTableDropdown from "./DataTableDropdown.vue";
import { createColumns } from "./columns";
import type { Property } from "./_property";
import { useToast } from "@/components/ui/toast/use-toast";

const router = useRouter();
const { $t } = useNuxtApp();
const { toast } = useToast();
const properties = ref<Property[]>([]);
const loading = ref(true);

const columns = createColumns($t);

const fetchProperties = async () => {
  loading.value = true;
  try {
    properties.value = await $fetch<Property[]>("/api/properties");
  } catch (error) {
    console.error("Error fetching properties:", error);
    toast({
      title: "Erro",
      description: "Erro ao carregar propriedades",
      variant: "destructive",
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProperties();
});
</script>
