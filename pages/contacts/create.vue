<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center justify-center gap-4">
        <div>
          <Button
            variant="ghost"
            class="rounded-full w-12 h-12 hover:shadow hover:bg-white text-xl"
            @click="router.push('/contacts')"
          >
            <i class="fa-light fa-arrow-left"></i>
          </Button>
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight">
            {{ $t("cpcv.contacts.modals.contactType") }}
          </h2>
          <p class="text-muted-foreground">
            {{ $t("cpcv.contacts.modals.contactTypeDescription") }}
          </p>
        </div>
      </div>
      <div></div>
    </div>

    <Card>
      <CardContent>
        <FormsCreateContact @onContactCreate="handleContactCreate" />
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

const router = useRouter();

const handleContactCreate = () => {
  router.push("/contacts");
};
</script>
