<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="seller-select space-y-2">
      <Label class="text-sm font-medium text-gray-700"> Vendedor </Label>
      <Select v-model="selectedSellerId">
        <SelectTrigger
          class="w-full bg-white border-gray-200 hover:border-gray-300"
        >
          <SelectValue placeholder="Selecione o Vendedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-if="contacts.length > 0">
            <SelectItem
              v-for="contact in contacts"
              :key="contact.id"
              :value="contact.id?.toString() ?? ''"
            >
              {{ contact.name }}
            </SelectItem>
          </SelectGroup>
          <div v-else class="p-4 text-center">
            <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
            <NuxtLink
              to="/contacts/create"
              class="text-primary hover:underline font-medium"
            >
              Clique aqui para adicionar um contato
            </NuxtLink>
          </div>
        </SelectContent>
      </Select>
    </div>

    <div class="buyer-select space-y-2">
      <Label class="text-sm font-medium text-gray-700"> Comprador </Label>
      <Select v-model="selectedBuyerId">
        <SelectTrigger
          class="w-full bg-white border-gray-200 hover:border-gray-300"
        >
          <SelectValue placeholder="Selecione o comprador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-if="contacts.length > 0">
            <SelectItem
              v-for="contact in contacts.filter(
                (c) => c.id?.toString() !== selectedSellerId
              )"
              :key="contact.id"
              :value="contact.id?.toString() ?? ''"
            >
              {{ contact.name }}
            </SelectItem>
          </SelectGroup>
          <div v-else class="p-4 text-center">
            <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
            <NuxtLink
              to="/contacts/create"
              class="text-primary hover:underline font-medium"
            >
              Clique aqui para adicionar um contato
            </NuxtLink>
          </div>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Contact } from "~/pages/contacts/_contacts";

const props = defineProps<{
  contacts: Contact[];
}>();

const selectedSellerId = ref<string>("-1");
const selectedBuyerId = ref<string>("-1");

watch(selectedSellerId, (newValue) => {
  const selectedContact = props.contacts.find(
    (contact) => contact.id === Number(newValue)
  );
  selectedSeller.value = selectedContact ?? undefined;
});

watch(selectedBuyerId, (newValue) => {
  const selectedContact = props.contacts.find(
    (contact) => contact.id === Number(newValue)
  );
  selectedBuyer.value = selectedContact ?? undefined;
});

const selectedSeller = ref<Contact>();
const selectedBuyer = ref<Contact>();

const emits = defineEmits<{
  onSelectBuyer: [Contact];
  onSelectSeller: [Contact];
}>();

watch(selectedSeller, (contact) => {
  if (!contact) return;
  emits("onSelectSeller", contact);
});

watch(selectedBuyer, (contact) => {
  if (!contact) return;
  emits("onSelectBuyer", contact);
});
</script>
