<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="seller-select space-y-2">
      <Label class="text-sm font-medium text-gray-700"> Vendedor </Label>
      <Select v-model="selectedSellerId" multiple>
        <SelectTrigger
          class="w-full bg-white border-gray-200 hover:border-gray-300"
        >
          <SelectValue placeholder="Selecione o Vendedor" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-if="contacts.length > 0">
            <SelectItem
              v-for="contact in sellerContacts"
              :key="contact.id"
              :value="contact.id?.toString() ?? ''"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    contact.image ||
                    'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                  "
                  class="w-8 h-8 rounded-lg object-cover"
                  alt="Contact image"
                />
                <span>{{ contact.name }}</span>
              </div>
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
      <Select v-model="selectedBuyerId" multiple>
        <SelectTrigger
          class="w-full bg-white border-gray-200 hover:border-gray-300"
        >
          <SelectValue placeholder="Selecione o comprador" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup v-if="contacts.length > 0">
            <SelectItem
              v-for="contact in buyerContacts"
              :key="contact.id"
              :value="contact.id?.toString() ?? ''"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    contact.image ||
                    'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                  "
                  class="w-8 h-8 rounded-lg object-cover"
                  alt="Contact image"
                />
                <span>{{ contact.name }}</span>
              </div>
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

const selectedSellerId = ref<string[]>([]);
const selectedBuyerId = ref<string[]>([]);

watch(selectedSellerId, (newValue) => {
  const selectedContact = props.contacts.filter((c) =>
    newValue.includes(c.id?.toString() ?? "")
  );
  selectedSeller.value = selectedContact;
});

watch(selectedBuyerId, (newValue) => {
  const selectedContact = props.contacts.filter((c) =>
    newValue.includes(c.id?.toString() ?? "")
  );
  selectedBuyer.value = selectedContact;
});

const selectedSeller = ref<Contact[]>();
const selectedBuyer = ref<Contact[]>();

const emits = defineEmits<{
  onSelectBuyer: [Contact[]];
  onSelectSeller: [Contact[]];
}>();

watch(selectedSeller, (contact) => {
  if (!contact) return;
  emits("onSelectSeller", contact);
});

watch(selectedBuyer, (contact) => {
  if (!contact) return;
  emits("onSelectBuyer", contact);
});

const buyerContacts = computed(() => {
  return props.contacts.filter((c) => {
    return !selectedSellerId.value.find((id) => id === c.id?.toString());
  });
});

const sellerContacts = computed(() => {
  return props.contacts.filter(
    (c) => !selectedBuyerId.value?.includes(c.id?.toString() ?? "")
  );
});
</script>
