<template>
  <div class="container mx-auto py-8 no-select">
    <div v-if="error" class="text-red-500 text-center">
      {{ $t(error) }}
    </div>
    <div v-else>
      <!-- Botões de download apenas para usuário autenticado e dono do contrato -->
      <div v-if="isOwner" class="flex justify-end gap-4 mb-4 allow-pointer">
        <Button @click="downloadAsPDF" :disabled="loadingPDF">
          <Loader2 v-if="loadingPDF" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t('contracts.downloadAsPDF') }}
        </Button>
        <Button @click="downloadAsDocx" :disabled="loadingDocx">
          <Loader2 v-if="loadingDocx" class="mr-2 h-4 w-4 animate-spin" />
          {{ $t('contracts.downloadAsDocx') }}
        </Button>
      </div>

      <!-- Conteúdo do contrato -->
      <div 
        v-html="contract?.htmlContent" 
        class="w-full contract-content"
        :class="{ 'shared-view': !isOwner }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contract } from './_contract';
import { PRICES } from '~/server/config/prices';
import type { Toast } from '@/types/toast';
import { Loader2 } from 'lucide-vue-next';

definePageMeta({
  layout: "default",
  auth: false // Permitindo acesso sem autenticação
});

const route = useRoute();
const nuxtApp = useNuxtApp();
const $t = nuxtApp.$t;
const $toast = nuxtApp.$toast as Toast;

const contract = ref<Contract | null>(null);
const error = ref<string | null>(null);
const loadingPDF = ref(false);
const loadingDocx = ref(false);

const isOwner = computed(() => {
  if (!contract.value) return false;
  const { user } = useUserSession();
  return user.value?.id === contract.value.generatedBy;
});

// Proteções contra debug
onMounted(() => {
  // Desabilitar atalhos comuns
  window.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + I/J/K/C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'K' || e.key === 'k' || e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
    }
    // Ctrl/Cmd + U
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }
  });

  // Desabilitar menu de contexto
  window.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.allow-pointer')) {
      e.preventDefault();
    }
  });

  // Detectar e desabilitar o console do navegador
  const disableDebugger = () => {
    setInterval(() => {
      const before = new Date().getTime();
      debugger;
      const after = new Date().getTime();
      if (after - before > 100) {
        // Console está aberto
        window.location.reload();
      }
    }, 1000);
  };

  disableDebugger();
});

// Buscar o contrato
onMounted(async () => {
  try {
    const token = route.query.token as string;
    const response = await $fetch<Contract | { error: string }>(`/api/contracts/${route.params.id}${token ? `?token=${token}` : ''}`);
    
    if ('error' in response) {
      error.value = response.error;
    } else {
      contract.value = response;
    }
  } catch (e) {
    error.value = 'contracts.errors.loadFailed';
  }
});

// Função para download como PDF
const downloadAsPDF = async () => {
  loadingPDF.value = true;
  try {
    const response = await $fetch<{ file: string; error?: string }>(`/api/contracts/${route.params.id}/download/pdf`, {
      method: 'POST'
    });
    
    if ('error' in response && response.error) {
      $toast.error($t(response.error));
      loadingPDF.value = false;
      return;
    }
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${response.file}`;
    link.download = `contract-${route.params.id}.pdf`;
    
    // Criar um evento para detectar quando o download terminar
    const checkDownloadComplete = () => {
      setTimeout(() => {
        loadingPDF.value = false;
        $toast.success($t('contracts.downloadSuccess'));
      }, 1000);
    };

    // Adicionar o evento e iniciar o download
    link.addEventListener('click', checkDownloadComplete);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    $toast.error($t('contracts.errors.downloadFailed'));
    loadingPDF.value = false;
  }
};

// Função para download como DOCX
const downloadAsDocx = async () => {
  loadingDocx.value = true;
  try {
    const response = await $fetch<{ file: string; error?: string }>(`/api/contracts/${route.params.id}/download/docx`, {
      method: 'POST'
    });
    
    if ('error' in response && response.error) {
      $toast.error($t(response.error));
      loadingDocx.value = false;
      return;
    }
    
    // Criar um link temporário para download
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${response.file}`;
    link.download = `contract-${route.params.id}.docx`;
    
    // Criar um evento para detectar quando o download terminar
    const checkDownloadComplete = () => {
      setTimeout(() => {
        loadingDocx.value = false;
        $toast.success($t('contracts.downloadSuccess'));
      }, 1000);
    };

    // Adicionar o evento e iniciar o download
    link.addEventListener('click', checkDownloadComplete);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    $toast.error($t('contracts.errors.downloadFailed'));
    loadingDocx.value = false;
  }
};
</script>

<style>
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.allow-pointer {
  pointer-events: all !important;
  user-select: text !important;
}

.contract-content {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

.contract-content.shared-view {
  user-select: none;
  pointer-events: none;
}

/* Desabilitar seleção de texto em imagens */
img {
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

/* Desabilitar seleção de texto em geral */
::selection {
  background: transparent;
  color: inherit;
}

::-moz-selection {
  background: transparent;
  color: inherit;
}
</style> 