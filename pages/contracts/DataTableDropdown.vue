<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="h-8 w-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="openViewDialog">
        <Eye class="mr-2 h-4 w-4" />
        <span>{{ $t('shared.actions.view') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleShare">
        <Share2 class="mr-2 h-4 w-4" />
        <span>{{ $t('contracts.share.button') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDownload" :disabled="isDownloading">
        <Download class="mr-2 h-4 w-4" :class="{ 'animate-spin': isDownloading }" />
        <span>{{ $t('contracts.downloadAsPDF') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="navigateToEdit">
        <Edit class="mr-2 h-4 w-4" />
        <span>{{ $t('shared.actions.edit') }}</span>
      </DropdownMenuItem>
      <DropdownMenuItem @click="handleDelete">
        <Trash class="mr-2 h-4 w-4" />
        <span>{{ $t('shared.actions.delete') }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ViewContractDialog
    :is-open="isViewDialogOpen"
    :contract="contract"
    @update:open="isViewDialogOpen = $event"
  />
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Eye, Download, Share2 } from "lucide-vue-next";
import type { Contract } from "./_contract";
import ViewContractDialog from "@/components/contract/ViewContractDialog.vue";
import { generateContractHtml } from '~/utils/contract-html';
import type { Toast } from '~/types/toast';
import { useToast } from "~/components/ui/toast";
import { useNuxtApp } from 'nuxt/app';

const props = defineProps<{
  contract: Contract;
}>();

const router = useRouter();
const isViewDialogOpen = ref(false);
const isDownloading = ref(false);
const html2pdfModule = ref<any>(null);

const { $t } = useNuxtApp();
const toast = useToast();

// Load html2pdf only on client side
onMounted(async () => {
  if (process.client) {
    html2pdfModule.value = (await import('html2pdf.js')).default;
  }
});

const navigateToEdit = () => {
  router.push(`/contracts/${props.contract.id}/edit`);
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
    const seller = props.contract.contacts.find(c => c.contactType === 'seller')?.contacts;
    const buyer = props.contract.contacts.find(c => c.contactType === 'buyer')?.contacts;
    
    if (!seller || !buyer) {
      throw new Error('Dados do contrato incompletos');
    }

    const html = generateContractHtml({
      type: props.contract.contractType,
      seller,
      buyer,
      property: props.contract.property,
      price: props.contract.price,
      isPreview: true
    });

    // Create a temporary div to hold the HTML
    const element = document.createElement('div');
    element.innerHTML = html;
    document.body.appendChild(element);

    try {
      await html2pdfModule.value()
        .from(element)
        .save(`contrato_${props.contract.id}.pdf`);
    } finally {
      // Clean up the temporary element
      document.body.removeChild(element);
    }
  } catch (e) {
    console.error('Error downloading PDF:', e);
  } finally {
    isDownloading.value = false;
  }
};

const handleDelete = async () => {
  // TODO: Implement delete functionality
  console.log("Delete contract:", props.contract.id);
};

const handleShare = async () => {
  try {
    const response = await $fetch<{ shareToken: string; shareUrl: string; error?: string }>(`/api/contracts/${props.contract.id}/share`, {
      method: 'POST'
    });
    
    if (!response.error && response.shareUrl) {
      await navigator.clipboard.writeText(response.shareUrl);
      toast.toast({
        title: $t('contracts.share.success'),
        variant: 'success',
        duration: 3000
      });
    }
  } catch (error) {
    console.error('Error sharing contract:', error);
    toast.toast({
      title: $t('contracts.share.error'),
      variant: 'errors',
      duration: 3000
    });
  }
};
</script> 