<template>
  <div class="pb-12 md:pb-0">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center justify-center gap-4">
        <div>
          <Button
            variant="ghost"
            class="rounded-full w-12 h-12 hover:shadow hover:bg-white text-xl"
            @click="router.push('/properties')"
          >
            <i class="fa-light fa-arrow-left"></i>
          </Button>
        </div>
        <div>
          <h2 class="text-3xl font-bold tracking-tight">Criar Imóvel</h2>
          <p class="text-muted-foreground">Preencha os dados do imóvel</p>
        </div>
      </div>
      <div></div>
    </div>

    <Card>
      <CardContent>
        <FormsCreateProperty
          @onPropertyCreate="handlePropertyCreate"
          is-buttons-fixed
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
import type { Property } from "./_property";
import { useToast } from "@/components/ui/toast/use-toast";

const router = useRouter();
const { toast } = useToast();

const handlePropertyCreate = () => {
  router.push("/properties");
};
</script>
