<template>
  <div>
    <!-- Seu conteúdo atual da página de contratos -->
    
    <!-- Tour do contrato -->
    <Tour
      :steps="contractTourSteps"
      tour-key="contract-creation-tour"
      trigger-button-text="Tutorial"
    />
  </div>
</template>

<script setup lang="ts">
import Tour from '@/components/ui/Tour.vue';

// Defina os passos do tour do contrato
const contractTourSteps = [
  {
    target: '.contract-type-select button',
    content: 'Primeiro, selecione o tipo de contrato que deseja criar: CPCV (Compra e Venda) ou Arrendamento',
    placement: 'bottom',
  },
  {
    target: '.seller-select button',
    content: 'Selecione o vendedor (para CPCV) ou arrendatário (para Arrendamento)',
    placement: 'bottom',
  },
  {
    target: '.buyer-select button',
    content: 'Selecione o comprador (para CPCV) ou senhorio (para Arrendamento)',
    placement: 'bottom',
  },
  {
    target: '.property-select button',
    content: 'Selecione o imóvel que será objeto do contrato',
    placement: 'bottom',
  },
  {
    target: '.preview-section',
    content: 'Aqui você verá uma prévia do contrato em tempo real. Você pode editar os campos clicando neles.',
    placement: 'top',
  },
];
</script> 