<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">
          {{ $t("cpcv.contacts.title") }}
        </h2>
        <p class="text-muted-foreground">
          {{ $t("cpcv.contacts.description") }}
        </p>
      </div>
      <Button
        class="tour-target-button"
        @click="router.push('/contacts/create')"
        :disabled="isTourActive"
      >
        <i class="fa-light fa-plus mr-2"></i>
        {{ $t("cpcv.contacts.modals.form.inputs.add") }}
      </Button>
    </div>

    <!-- <Tour
      :steps="tourSteps"
      tour-key="contacts-tour"
      :trigger-button-text="$t('cpcv.contacts.tour.startTour')"
      @tour-start="handleTourStart"
      @tour-complete="handleTourComplete"
    /> -->

    <Card>
      <CardContent class="pt-6">
        <div class="tour-target-table bg-white">
          <DataTable :columns="columns" :data="contacts" :loading="loading" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from "@/components/dataTable/DataTable.vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useRouter } from "vue-router";
import { createColumns } from "./columns";
import Tour from "@/components/ui/Tour.vue";
import type { Contact } from "./_contacts";

definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
  colorMode: "light",
});

const router = useRouter();
const route = useRoute();
const { $t } = useNuxtApp();
const { toast } = useToast();

const loading = ref(false);
const contacts = ref<Contact[]>([]);
const isTourActive = ref(false);

const updateContact = async () => {
  await fetchContacts();
};

const columns = createColumns($t, updateContact);

const tourSteps = ref([
  {
    target: ".tour-target-button",
    content: $t("cpcv.contacts.tour.addContact"),
    placement: "bottom",
  },
  {
    target: ".tour-target-table",
    content: $t("cpcv.contacts.tour.viewContacts"),
    placement: "bottom",
  },
]);

const handleTourStart = () => {
  isTourActive.value = true;
};

const handleTourComplete = () => {
  isTourActive.value = false;
};

const handleDelete = async (contact: Contact) => {
  if (!confirm($t("cpcv.contacts.confirmDelete"))) return;

  const response = await $fetch<{ success?: boolean }>(
    `/api/contacts/${contact.id}`,
    {
      method: "DELETE",
    }
  ).catch((err) => err.response);

  if (response.success) {
    toast({
      title: $t("cpcv.contacts.deleted"),
      description: $t("cpcv.contacts.deletedDescription"),
      variant: "success",
    });
    await fetchContacts();
  }
};

const fetchContacts = async () => {
  loading.value = true;
  contacts.value = await $fetch<Contact[]>("/api/contacts").finally(() => {
    loading.value = false;
  });
};

onMounted(() => {
  fetchContacts();
});

watch(
  () => route.query,
  (newQuery) => {
    if (newQuery?.deleted) {
      toast({
        title: $t("cpcv.contacts.deleted"),
        description: $t("cpcv.contacts.deletedDescription"),
        variant: "success",
      });
      fetchContacts();
    }
  },
  { immediate: true }
);
</script>
