<template>
  <div>
    <!-- Seu conteúdo atual da dashboard -->
    
    <!-- Tour da dashboard -->
    <Tour
      :steps="dashboardTourSteps"
      tour-key="dashboard-tour"
      :auto-start="true"
      :show-trigger-button="false"
      @tour-complete="onTourComplete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});
import Tour from '@/components/ui/Tour.vue';

// Defina os passos do tour da dashboard
const dashboardTourSteps = [
  {
    target: '.tour-target-sidebar-contacts',
    content: 'Aqui você pode criar, editar e visualizar seus contratos',
    placement: 'right',
  },
  {
    target: '.tour-target-sidebar-properties',
    content: 'Aqui você pode criar, editar e visualizar seus imóveis',
    placement: 'right',
  },
  {
    target: '.tour-target-sidebar-contracts',
    content: 'Aqui você pode criar, editar e visualizar seus contatos',
    placement: 'right',
  },
];

const onTourComplete = () => {
  console.log('Tour da dashboard concluído!');
};
</script> 