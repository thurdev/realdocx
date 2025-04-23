<template>
  <div class="flex flex-col flex-1 gap-4">
    <Label>{{ $t("contracts.type") }}</Label>
    <div class="flex gap-4 flex-wrap justify-center">
      <Card
        class="flex-1 hover:transform hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer"
        v-for="(template, templateIndex) in templates"
        @click="selectedTemplateIndex = templateIndex.toString()"
        :key="templateIndex"
      >
        <CardHeader class="flex flex-col gap-4 items-center justify-center">
          <i class="fa-light text-5xl text-primary" :class="template.icon" />
          <div class="flex flex-col items-center justify-center">
            <CardTitle class="text-xl">{{ template.name }}</CardTitle>
            <CardDescription>{{ template.description }}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>

    <div
      v-if="!selectedTemplateIndex"
      class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md"
    >
      <div class="flex items-center gap-2">
        <i class="fa-light fa-info-circle text-blue-500"></i>
        <p class="text-sm text-blue-700">
          {{ $t("contracts.selectTypeInfo") }}
        </p>
      </div>
    </div>

    <div
      v-else-if="selectedTemplate?.description && !hasBalance"
      class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
    >
      <div class="flex items-center gap-2">
        <i class="fa-light fa-info-circle text-yellow-500"></i>
        <p class="text-sm text-yellow-700">
          Este contrato tem um custo de
          <span class="font-bold">{{
            new Intl.NumberFormat("pt-PT", {
              style: "currency",
              currency: "EUR",
            }).format(selectedTemplate?.price || 0)
          }}</span
          >.
          <span class="font-medium">
            Seu saldo atual é
            <span class="font-bold">€{{ wallet.balance }}</span
            >.
            <br />
            <NuxtLink
              to="/wallet"
              class="text-primary hover:underline font-bold"
            >
              Clique aqui para adicionar saldo
            </NuxtLink>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { getTemplates } from ".";
import { useWallet } from "@/composable/useWallet";
import type { ContractTemplate } from "./_templates";
const model = defineModel();
const wallet = useWallet();

const templates = ref<ContractTemplate[]>([]);

onMounted(async () => {
  templates.value = await getTemplates();
  await wallet.fetchBalance();
});

// Template Index
const selectedTemplateIndex = ref<string>();
const selectedTemplate = ref<ContractTemplate>();

watch(
  selectedTemplateIndex,
  (newValue) => {
    if (newValue !== "-1") {
      selectedTemplate.value = templates.value[Number(newValue)];
      model.value = selectedTemplate.value;
    } else {
      selectedTemplate.value = undefined;
    }
  },
  { immediate: true }
);

const hasBalance = computed(() => {
  return wallet.hasBalance(selectedTemplate?.value?.price || 0);
});
</script>
