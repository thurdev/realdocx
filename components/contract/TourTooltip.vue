<template>
  <div
    v-if="isVisible"
    class="tour-tooltip"
    :style="tooltipStyles"
  >
    <div class="flex flex-col gap-4">
      <p class="text-sm text-gray-600">{{ content }}</p>
      <div class="flex items-center justify-between min-w-[300px]">
        <div class="w-[100px]">
          <Button
            v-if="currentStep > 0"
            variant="outline"
            size="sm"
            @click="onPrevious"
          >
            <ChevronLeft class="h-4 w-4" />
            Anterior
          </Button>
        </div>

        <span class="text-sm text-gray-500">
          {{ currentStep + 1 }}/{{ totalSteps }}
        </span>

        <div class="w-[100px] flex justify-end">
          <Button
            v-if="!isLastStep"
            variant="outline"
            size="sm"
            @click="onNext"
          >
            Próximo
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            v-else
            variant="default"
            size="sm"
            @click="onNext"
          >
            Finalizar
            <CheckCircle class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-vue-next';

const props = defineProps<{
  isVisible: boolean;
  content: string;
  currentStep: number;
  totalSteps: number;
  tooltipStyles: Record<string, string>;
}>();

const isLastStep = computed(() => props.currentStep === props.totalSteps - 1);

const emit = defineEmits<{
  next: [];
  previous: [];
  close: [];
}>();

const onNext = () => emit('next');
const onPrevious = () => emit('previous');
const onClose = () => emit('close');
</script>

<style scoped>
.tour-tooltip {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  min-width: 350px;
  z-index: 1000;
}
</style> 