<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{{ $t("shared.actions") }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="openViewDialog">
        <Eye class="mr-2 h-4 w-4" />
        <span>{{ $t("shared.actions.view") }}</span>
      </DropdownMenuItem>

      <!-- <DropdownMenuItem @click="navigateToEdit">
        <Edit class="mr-2 h-4 w-4" />
        <span>{{ $t("shared.actions.edit") }}</span>
      </DropdownMenuItem> -->
      <DropdownMenuItem @click="handleShare">
        <Share2 class="mr-2 h-4 w-4" />
        <span>{{ $t("contracts.share.button") }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDownload" :disabled="isDownloading">
        <Download
          class="mr-2 h-4 w-4"
          :class="{ 'animate-spin': isDownloading }"
        />
        <span>{{ $t("contracts.downloadAsPDF") }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDeleteContract">
        <Trash class="mr-2 h-4 w-4" />
        <span>{{ $t("shared.actions.delete") }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ViewContractDialog
    :is-open="isViewDialogOpen"
    :contract="contract"
    @update:open="isViewDialogOpen = $event"
  />

  <DialogsEditContract
    :is-open="isEditDialogOpen"
    :contract="contract"
    @update:open="isEditDialogOpen = $event"
  />
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Download,
  Share2,
} from "lucide-vue-next";
import type { Contract } from "./_contract";
import ViewContractDialog from "@/components/contract/ViewContractDialog.vue";
import { generateContractHtml } from "./templates/cpcv/review";
import type { Toast } from "~/types/toast";
import { useToast } from "@/components/ui/toast/use-toast";
import { useNuxtApp } from "nuxt/app";

const props = defineProps<{
  contract: Contract;
}>();

const router = useRouter();
const isViewDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const isDownloading = ref(false);
const html2pdfModule = ref<any>(null);

const { $t } = useNuxtApp();
const { toast } = useToast();

// Load html2pdf only on client side
onMounted(async () => {
  if (process.client) {
    html2pdfModule.value = (await import("html2pdf.js")).default;
  }
});

const navigateToEdit = () => {
  isEditDialogOpen.value = true;
};

const openViewDialog = () => {
  isViewDialogOpen.value = true;
};

const handleDownload = async () => {
  if (!props.contract || !html2pdfModule.value || !process.client) {
    return;
  }

  isDownloading.value = true;

  try {
    const response = await $fetch<{ file: string; error?: string }>(
      `/api/contracts/${props.contract.id}/download/pdf`,
      {
        method: "POST",
      }
    );

    if ("error" in response && response.error) {
      toast({
        title: $t("shared.error"),
        description: response.error,
        variant: "errors",
      });
      isDownloading.value = false;
      return;
    }

    // Criar um link temporário para download
    const link = document.createElement("a");
    link.href = `data:application/pdf;base64,${response.file}`;
    link.download = `contract-${props.contract.id}.pdf`;

    // Criar um evento para detectar quando o download terminar
    const checkDownloadComplete = () => {
      setTimeout(() => {
        isDownloading.value = false;
        toast({
          title: $t("contracts.downloadSuccess"),
          variant: "success",
        });
      }, 1000);
    };

    // Adicionar o evento e iniciar o download
    link.addEventListener("click", checkDownloadComplete);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    toast({
      title: $t("contracts.errors.downloadFailed"),
      variant: "errors",
    });
    isDownloading.value = false;
  }
};

const handleDeleteContract = async () => {
  const response = await $fetch<{ success?: boolean; error?: string }>(
    "/api/contracts/delete",
    {
      method: "POST",
      body: { id: props.contract.id },
    }
  );

  console.log(response);

  if (response.success) {
    toast({
      title: $t("shared.deleted"),
      description: $t("contracts.deleted"),
      variant: "success",
    });
    navigateTo("/contracts?deleted=" + props.contract.id);
  } else if (response.error) {
    toast({
      title: $t("shared.error"),
      description: response.error,
      variant: "errors",
    });
  }
};

const handleShare = async () => {
  try {
    const response = await $fetch<{
      shareToken: string;
      shareUrl: string;
      error?: string;
    }>(`/api/contracts/${props.contract.id}/share`, {
      method: "POST",
    });

    if (!response.error && response.shareUrl) {
      await navigator.clipboard.writeText(response.shareUrl);
      toast({
        title: $t("contracts.share.success"),
        variant: "success",
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Error sharing contract:", error);
    toast({
      title: $t("contracts.share.error"),
      variant: "errors",
      duration: 3000,
    });
  }
};
</script>
