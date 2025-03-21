<template>
  <div>
    <!-- Seu conteúdo atual da página de contratos -->
    
    <!-- Tour do contrato -->
    <Tour
      :steps="contractTourSteps"
      tour-key="contract-creation-tour"
      trigger-button-text="Tutorial"
      @tour-start="$emit('tourStart')"
      @tour-complete="$emit('tourComplete')"
      @step-next="$emit('stepNext', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import Tour from '@/components/ui/Tour.vue';

interface TourStep {
  target: string;
  content: string;
  placement: 'top' | 'right' | 'bottom' | 'left' | 'bottom-right';
}

const contractTourSteps: TourStep[] = [
  {
    target: '.contract-type-select',
    content: 'Primeiro, selecione o tipo de contrato que deseja criar: Compra e Venda (CPCV) ou Arrendamento',
    placement: 'bottom',
  },
  {
    target: '.seller-select',
    content: 'Selecione o vendedor (para CPCV) ou arrendatário (para Arrendamento)',
    placement: 'bottom',
  },
  {
    target: '.buyer-select',
    content: 'Selecione o comprador (para CPCV) ou senhorio (para Arrendamento)',
    placement: 'bottom',
  },
  {
    target: '.property-select',
    content: 'Selecione o imóvel que será objeto do contrato',
    placement: 'bottom',
  },
  {
    target: '.preview-section',
    content: 'Aqui você verá uma prévia do contrato em tempo real. Você pode editar os campos clicando neles.',
    placement: 'top',
  },
];

defineEmits<{
  (e: 'tourStart'): void;
  (e: 'tourComplete'): void;
  (e: 'stepNext', step: number): void;
}>();
</script> 