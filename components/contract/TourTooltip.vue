<template>
  <div
    v-if="isVisible"
    class="tour-tooltip relative bg-white rounded-lg shadow-lg p-4"
    :style="tooltipStyles"
  >
    <Button
      variant="ghost"
      size="icon"
      class="absolute right-2 top-2 hover:bg-gray-100 rounded-full"
      @click="onClose"
    >
      <X class="h-4 w-4" />
    </Button>
    <div class="flex flex-col gap-4">
      <p class="text-sm text-gray-600 pr-8">{{ content }}</p>
      <div class="flex items-center justify-between min-w-[300px]">
        <div class="w-[100px]">
          <Button
            v-if="currentStep > 0"
            variant="outline"
            size="sm"
            @click="onPrevious"
          >
            <ChevronLeft class="h-4 w-4" />
            {{ $t('tour.contacts.navigation.previous') }}
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
            {{ $t('tour.contacts.navigation.next') }}
            <ChevronRight class="h-4 w-4" />
          </Button>
          <Button
            v-else
            variant="default"
            size="sm"
            @click="onNext"
          >
            {{ $t('tour.contacts.navigation.finish') }}
            <CheckCircle class="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle, X } from 'lucide-vue-next';

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
  min-width: 350px;
  pointer-events: auto !important;
  cursor: default !important;
  user-select: text !important;
}

.tour-tooltip button {
  pointer-events: auto !important;
  cursor: pointer !important;
}
</style> 