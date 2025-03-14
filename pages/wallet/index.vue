<template>
  <div class="">
    <h1 class="text-2xl font-bold">
      {{ $t("sidebar.wallet") }}
    </h1>
    <Tabs default-value="overview" class="mt-4">
      <TabsList class="border border-b">
        <TabsTrigger value="overview"> Overview </TabsTrigger>
        <TabsTrigger value="paymentMethods"> Payment Methods </TabsTrigger>
        <TabsTrigger value="billingHistory"> Billing History </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="p-8">
        <div class="w-full">
          <h2 class="text-xl font-bold">Pay as you go</h2>
          <div class="mt-4 flex flex-col gap-2">
            <p>Credit balance</p>
            <span class="text-3xl">€{{ remainingCredits.toFixed(2) }}</span>
            <Button class="w-[152px]" size="sm" variant="outline"
              >Add credit balance</Button
            >
          </div>

          <div class="mt-8">
            <div class="flex justify-between">
              <p>Credits used</p>
              <p>EUR</p>
            </div>

            <div class="flex items-center gap-4">
              <Progress v-model="progress" class="w-[100%]" />
              <div class="flex gap-1">
                <span>€{{ creditsUsed.toFixed(2) }}</span>
                <span>/</span>
                <span>€{{ creditsBought.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="paymentMethods" class="p-8">
        <div class="border rounded max-w-[328px] p-3 bg-white">
          <div class="flex gap-4 items-center justify-between">
            <img
              class="h-8"
              src="https://cdn.openai.com/API/images/payment-methods/visa.svg"
            />
            <div class="flex flex-col gap-1">
              <span>••••4475</span>
              <span class="text-sm text-gray-500">Expires 03/2029</span>
            </div>
            <div>
              <div class="bg-gray-400 text-white rounded p-1 text-xs">
                Default
              </div>
            </div>
          </div>

          <p class="text-red-500 text-sm hover:cursor-pointer hover:underline">
            Delete
          </p>
        </div>

        <Button class="w-[152px] mt-4" size="sm" variant="outline"
          >Add payment method</Button
        >
      </TabsContent>
      <TabsContent value="billingHistory" class="p-8">
        <DataTable :columns="columns" :data="contacts" />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { columns } from "@/pages/contacts/columns";
import type { Contact } from "../contacts/_contacts";

const creditsBought = ref(10);
const creditsUsed = ref(5);
const remainingCredits = ref(creditsBought.value - creditsUsed.value);

const contacts = ref<Contact[]>([]);

onMounted(async () => {
  contacts.value = await $fetch<Contact[]>("/api/contacts");
});

const progress = ref(0);

watchEffect((cleanupFn) => {
  const timer = setTimeout(() => {
    progress.value = (creditsUsed.value / creditsBought.value) * 100;
  }, 200);
  cleanupFn(() => clearTimeout(timer));
});
</script>
