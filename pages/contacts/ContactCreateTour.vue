<template>
  <div>
    <Tour
      :steps="contactTourSteps"
      tour-key="contact-creation-tour" 
      trigger-button-text="Tutorial"
      @tour-start="$emit('tourStart')"
      @tour-complete="$emit('tourComplete')"
      @step-next="$emit('stepNext', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import Tour from '@/components/ui/Tour.vue';

const contactTourSteps = [
  {
    target: '.flex.gap-2.pt-6 div:first-child',
    content: 'Primeiro, selecione "Pessoa Singular" para criar um contato individual',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-name',
    content: 'Digite o nome completo do contato',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-nif',
    content: 'Digite o NIF (Número de Identificação Fiscal) do contato',
    placement: 'bottom',
  },
  {
    target: '.tour-target-select-marital-status',
    content: 'Selecione o estado civil do contato',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-country',
    content: 'Digite o país de residência do contato',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-district',
    content: 'Digite o distrito de residência',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-city',
    content: 'Digite a cidade de residência',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-neighborhood',
    content: 'Digite o bairro de residência',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-address',
    content: 'Digite o endereço completo',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-zip-code',
    content: 'Digite o código postal',
    placement: 'bottom',
  },
  {
    target: '.tour-target-select-identity-type',
    content: 'Selecione o tipo de documento de identificação',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-identity-number',
    content: 'Digite o número do documento de identificação',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-identity-expiration-date',
    content: 'Selecione a data de validade do documento',
    placement: 'bottom',
  },
  {
    target: '.tour-target-input-identity-issuer',
    content: 'Digite o local de emissão do documento',
    placement: 'bottom',
  },
  
];
</script> 