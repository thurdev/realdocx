<template>
  <Dialog :open="isOpen" @update:open="$emit('update:open', $event)">
    <DialogContent class="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Visualizar Contrato</DialogTitle>
        <DialogDescription>
          Visualização do contrato
        </DialogDescription>
      </DialogHeader>
      
      <div v-if="contract" class="mt-4">
        <div class="w-full border rounded-lg p-8 bg-white" v-html="contractHtml"></div>
      </div>

      <DialogFooter class="mt-4">
        <Button @click="$emit('update:open', false)">Fechar</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Contract } from '~/pages/contracts/_contract';

const props = defineProps<{
  isOpen: boolean;
  contract: Contract | null;
}>();

defineEmits<{
  'update:open': [value: boolean];
}>();

const contractHtml = computed(() => {
  if (!props.contract) return '';
  
  const seller = props.contract.contacts.find(c => c.contactType === 'seller')?.contacts;
  const buyer = props.contract.contacts.find(c => c.contactType === 'buyer')?.contacts;
  
  if (!seller || !buyer) return '';

  return props.contract.htmlContent
});
</script> 