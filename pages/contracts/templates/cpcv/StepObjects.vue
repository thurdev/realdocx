<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="seller-select space-y-2">
      <Label class="text-sm font-medium text-gray-700">Vendedor(es)</Label>
      <Popover v-model:open="sellerOpen">
        <PopoverTrigger as-child class="pb-4 pt-4">
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="sellerOpen"
            class="w-full justify-between bg-white border-gray-200 hover:border-gray-300 h-12"
          >
            <div
              class="flex items-center gap-4"
              v-if="selectedSellers.length > 0"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    selectedSellers[0].image ||
                    'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                  "
                  class="w-8 h-8 rounded-lg object-cover"
                  alt="Contact image"
                />
                <span class="font-medium">{{ selectedSellers[0].name }}</span>
                <span
                  v-if="selectedSellers.length > 1"
                  class="text-sm text-gray-500"
                >
                  +{{ selectedSellers.length - 1 }} mais
                </span>
              </div>
            </div>
            <span v-else>Selecione o(s) vendedor(es)</span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="!w-[var(--radix-popover-trigger-width))] p-0">
          <Command>
            <CommandInput placeholder="Pesquisar vendedor..." />
            <CommandEmpty>Nenhum vendedor encontrado.</CommandEmpty>
            <CommandList>
              <CommandGroup v-if="sellerContacts.length > 0">
                <CommandItem
                  v-for="contact in sellerContacts"
                  :key="contact.id"
                  :value="contact.id?.toString() ?? ''"
                  @select="handleSelectSeller(contact)"
                >
                  <div class="flex items-center gap-4 w-full">
                    <img
                      :src="
                        contact.image ||
                        'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                      "
                      class="w-8 h-8 rounded-lg object-cover"
                      alt="Contact image"
                    />
                    <div class="flex flex-col flex-1">
                      <span class="font-medium">{{ contact.name }}</span>
                      <span class="text-sm text-gray-500"
                        >{{ contact.city }}, {{ contact.state }}</span
                      >
                    </div>
                    <Check
                      v-if="selectedSellers.find((c) => c.id === contact.id)"
                      class="w-4 h-4 text-green-600 ml-2"
                    />
                  </div>
                </CommandItem>

                <!-- Opção Criar Contato -->
                <CommandItem
                  value="create-contact"
                  @select="handleCreateContact('seller')"
                >
                  <div class="flex items-center gap-4 w-full">
                    <div
                      class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <Plus class="w-4 h-4 text-primary" />
                    </div>
                    <div class="flex flex-col flex-1">
                      <span class="font-medium text-primary"
                        >Criar Contato</span
                      >
                      <span class="text-sm text-gray-500"
                        >Adicionar novo contato</span
                      >
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>

              <div v-if="sellerContacts.length === 0" class="p-4 text-center">
                <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
                <button
                  @click="handleCreateContact('seller')"
                  class="text-primary hover:underline font-medium"
                >
                  Clique aqui para adicionar um contato
                </button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <div class="buyer-select space-y-2">
      <Label class="text-sm font-medium text-gray-700">Comprador(es)</Label>
      <Popover v-model:open="buyerOpen">
        <PopoverTrigger as-child class="pb-4 pt-4">
          <Button
            variant="outline"
            role="combobox"
            :aria-expanded="buyerOpen"
            class="w-full justify-between bg-white border-gray-200 hover:border-gray-300 h-12"
          >
            <div
              class="flex items-center gap-4"
              v-if="selectedBuyers.length > 0"
            >
              <div class="flex items-center gap-2">
                <img
                  :src="
                    selectedBuyers[0].image ||
                    'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                  "
                  class="w-8 h-8 rounded-lg object-cover"
                  alt="Contact image"
                />
                <span class="font-medium">{{ selectedBuyers[0].name }}</span>
                <span
                  v-if="selectedBuyers.length > 1"
                  class="text-sm text-gray-500"
                >
                  +{{ selectedBuyers.length - 1 }} mais
                </span>
              </div>
            </div>
            <span v-else>Selecione o(s) comprador(es)</span>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="!w-[var(--radix-popover-trigger-width))] p-0">
          <Command>
            <CommandInput placeholder="Pesquisar comprador..." />
            <CommandEmpty>Nenhum comprador encontrado.</CommandEmpty>
            <CommandList>
              <CommandGroup v-if="buyerContacts.length > 0">
                <CommandItem
                  v-for="contact in buyerContacts"
                  :key="contact.id"
                  :value="contact.id?.toString() ?? ''"
                  @select="handleSelectBuyer(contact)"
                >
                  <div class="flex items-center gap-4 w-full">
                    <img
                      :src="
                        contact.image ||
                        'https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg'
                      "
                      class="w-8 h-8 rounded-lg object-cover"
                      alt="Contact image"
                    />
                    <div class="flex flex-col flex-1">
                      <span class="font-medium">{{ contact.name }}</span>
                      <span class="text-sm text-gray-500"
                        >{{ contact.city }}, {{ contact.state }}</span
                      >
                    </div>
                    <Check
                      v-if="selectedBuyers.find((c) => c.id === contact.id)"
                      class="w-4 h-4 text-green-600 ml-2"
                    />
                  </div>
                </CommandItem>

                <!-- Opção Criar Contato -->
                <CommandItem
                  value="create-contact"
                  @select="handleCreateContact('buyer')"
                >
                  <div class="flex items-center gap-4 w-full">
                    <div
                      class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
                    >
                      <Plus class="w-4 h-4 text-primary" />
                    </div>
                    <div class="flex flex-col flex-1">
                      <span class="font-medium text-primary"
                        >Criar Contato</span
                      >
                      <span class="text-sm text-gray-500"
                        >Adicionar novo contato</span
                      >
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>

              <div v-if="buyerContacts.length === 0" class="p-4 text-center">
                <p class="text-gray-500 mb-2">Nenhum contato cadastrado</p>
                <button
                  @click="handleCreateContact('buyer')"
                  class="text-primary hover:underline font-medium"
                >
                  Clique aqui para adicionar um contato
                </button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>

    <!-- Modal para criar contato -->
    <Dialog v-model:open="showCreateContactModal">
      <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Contato</DialogTitle>
          <DialogDescription>
            Preencha os dados do novo contato
          </DialogDescription>
        </DialogHeader>
        <CreateContact
          @onContactCreate="handleContactCreated"
          successMessage="Contato criado com sucesso!"
        />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Contact } from "~/pages/contacts/_contacts";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronsUpDown, Check, Plus } from "lucide-vue-next";
import CreateContact from "@/components/forms/CreateContact.vue";

const props = defineProps<{
  contacts: Contact[];
}>();

const sellerOpen = ref(false);
const buyerOpen = ref(false);
const selectedSellers = ref<Contact[]>([]);
const selectedBuyers = ref<Contact[]>([]);
const showCreateContactModal = ref(false);
const pendingContactType = ref<"seller" | "buyer" | null>(null);

const emits = defineEmits<{
  onSelectBuyer: [Contact[]];
  onSelectSeller: [Contact[]];
  onRefreshContacts: [{ id: number; type: "seller" | "buyer" }?];
}>();

const handleSelectSeller = (contact: Contact) => {
  const isSelected = selectedSellers.value.find((c) => c.id === contact.id);
  if (isSelected) {
    selectedSellers.value = selectedSellers.value.filter(
      (c) => c.id !== contact.id
    );
  } else {
    selectedSellers.value.push(contact);
  }
  emits("onSelectSeller", selectedSellers.value);
};

const handleSelectBuyer = (contact: Contact) => {
  const isSelected = selectedBuyers.value.find((c) => c.id === contact.id);
  if (isSelected) {
    selectedBuyers.value = selectedBuyers.value.filter(
      (c) => c.id !== contact.id
    );
  } else {
    selectedBuyers.value.push(contact);
  }
  emits("onSelectBuyer", selectedBuyers.value);
};

const handleCreateContact = (type: "seller" | "buyer") => {
  pendingContactType.value = type;
  showCreateContactModal.value = true;

  // Fecha o popover
  if (type === "seller") {
    sellerOpen.value = false;
  } else {
    buyerOpen.value = false;
  }
};

const handleContactCreated = async (newContact: Contact) => {
  // Fecha o modal
  showCreateContactModal.value = false;

  pendingContactType.value = null;
};

const buyerContacts = computed(() => {
  return props.contacts.filter((c) => {
    return !selectedSellers.value.find((seller) => seller.id === c.id);
  });
});

const sellerContacts = computed(() => {
  return props.contacts.filter((c) => {
    return !selectedBuyers.value.find((buyer) => buyer.id === c.id);
  });
});
</script>
