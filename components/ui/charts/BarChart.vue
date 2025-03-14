<template>
  <canvas ref="chartRef"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { Chart, type ChartData, type ChartOptions } from 'chart.js/auto';

const props = defineProps<{
  data: ChartData;
  options?: ChartOptions;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const createChart = () => {
  if (!chartRef.value) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: props.data,
    options: {
      ...props.options,
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

onMounted(() => {
  createChart();
});

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy();
  }
});

watch(() => props.data, () => {
  createChart();
}, { deep: true });
</script> 