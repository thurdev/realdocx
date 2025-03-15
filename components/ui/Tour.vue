<template>
  <div>
    <Button
      v-if="!isTourStarted && showTriggerButton"
      variant="info"
      class="fixed bottom-4 right-4 z-50"
      @click="startTour"
    >
      <HelpCircle class="mr-2 h-4 w-4" />
      {{ triggerButtonText }}
    </Button>

    <!-- Overlay e conteúdo do tour -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isTourStarted" class="fixed inset-0 isolate" style="z-index: 998;">
          <!-- Overlay escuro -->
          <div class="fixed inset-0 bg-black/50 transition-opacity duration-300" />

          <!-- Container do highlight com animação -->
          <Transition name="highlight">
            <div
              v-if="highlightPosition"
              class="fixed transition-all duration-300 ease-in-out"
              :style="{
                top: `${highlightPosition.top}px`,
                left: `${highlightPosition.left}px`,
                width: `${highlightPosition.width}px`,
                height: `${highlightPosition.height}px`,
                zIndex: 999,
              }"
            >
              <!-- Borda brilhante -->
              <div
                class="absolute inset-[-4px] rounded-lg animate-pulse"
                style="background: linear-gradient(45deg, #2563eb, #3b82f6); opacity: 0.8;"
              ></div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Tooltip em um Teleport separado -->
    <Teleport to="body">
      <Transition name="slide-fade">
        <TourTooltip
          v-if="isTourStarted"
          :is-visible="isTourStarted"
          :content="currentStepContent"
          :current-step="currentStep"
          :total-steps="steps.length"
          :tooltip-styles="{
            ...tooltipStyles,
            zIndex: 1001,
          }"
          @next="nextStep"
          @previous="previousStep"
          @close="endTour"
        />
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-vue-next';
import TourTooltip from '../contract/TourTooltip.vue';

interface TourStep {
  target: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface Props {
  steps: TourStep[];
  tourKey?: string; // Chave única para identificar o tour no localStorage
  showTriggerButton?: boolean;
  triggerButtonText?: string;
  autoStart?: boolean; // Se deve iniciar automaticamente quando montado
}

const props = withDefaults(defineProps<Props>(), {
  tourKey: '',
  showTriggerButton: true,
  triggerButtonText: 'Tutorial',
  autoStart: false,
});

const emit = defineEmits<{
  (e: 'tourComplete'): void;
  (e: 'tourStart'): void;
}>();

const isTourStarted = ref(false);
const currentStep = ref(0);
const highlightPosition = ref<{ top: number; left: number; width: number; height: number } | null>(null);

const updateHighlightPosition = () => {
  // Remove a classe do elemento anterior e seu clone
  const previousTarget = document.querySelector('.tour-target');
  const previousClone = document.querySelector('.tour-target-clone');
  if (previousTarget) {
    previousTarget.classList.remove('tour-target');
  }
  if (previousClone) {
    previousClone.remove();
  }

  const step = props.steps[currentStep.value];
  if (!step) {
    highlightPosition.value = null;
    return;
  }

  const target = document.querySelector(step.target);
  if (!target) {
    highlightPosition.value = null;
    return;
  }

  // Atualiza a posição do highlight
  const rect = target.getBoundingClientRect();
  highlightPosition.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };

  // Cria um clone do elemento alvo
  const clone = target.cloneNode(true) as HTMLElement;
  clone.classList.add('tour-target-clone');
  
  // Posiciona o clone exatamente sobre o original
  Object.assign(clone.style, {
    position: 'fixed',
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    zIndex: '1000',
    backgroundColor: 'white',
    borderRadius: getComputedStyle(target).borderRadius,
    opacity: '0',
    pointerEvents: 'auto', // Permite clicar no clone
    cursor: 'pointer',
  });

  // Adiciona o clone ao body
  document.body.appendChild(clone);

  // Adiciona os mesmos event listeners do original ao clone
  const originalClickListener = target.onclick;
  if (originalClickListener) {
    clone.onclick = originalClickListener;
  }

  // Fade in do clone
  setTimeout(() => {
    clone.style.opacity = '1';
    clone.style.transition = 'opacity 0.3s ease';
  }, 100);
};

const tooltipStyles = computed(() => {
  const step = props.steps[currentStep.value];
  if (!step) return {};

  const target = document.querySelector(step.target);
  if (!target) return {};

  const rect = target.getBoundingClientRect();
  const defaultOffset = 20;
  const bottomOffset = 10;
  const tooltipWidth = 350;
  const windowWidth = window.innerWidth;

  let x = 0;
  let y = 0;

  switch (step.placement) {
    case 'bottom':
      x = rect.left + (rect.width / 2);
      x = Math.min(Math.max(tooltipWidth / 2, x), windowWidth - tooltipWidth / 2);
      y = rect.bottom + bottomOffset;
      break;
    case 'top':
      x = rect.left + (rect.width / 2);
      x = Math.min(Math.max(tooltipWidth / 2, x), windowWidth - tooltipWidth / 2);
      y = rect.top - defaultOffset;
      break;
    case 'left':
      x = rect.left - defaultOffset;
      y = rect.top + (rect.height / 2);
      break;
    case 'right':
      x = rect.right + defaultOffset;
      y = rect.top + (rect.height / 2);
      y = y + 32;
      break;
  }

  return {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translate(-50%, 0)',
  };
});

const currentStepContent = computed(() => props.steps[currentStep.value]?.content || '');
const isLastStep = computed(() => currentStep.value === props.steps.length - 1);

const startTour = () => {
  isTourStarted.value = true;
  currentStep.value = 0;
  emit('tourStart');
  nextTick(() => {
    updateHighlightPosition();
  });
};

const nextStep = () => {
  if (isLastStep.value) {
    endTour();
    return;
  }
  currentStep.value++;
  nextTick(() => {
    updateHighlightPosition();
  });
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    nextTick(() => {
      updateHighlightPosition();
    });
  }
};

const endTour = () => {
  nextTick(() => {
    // Remove a classe do elemento alvo
    const target = document.querySelector('.tour-target');
    if (target) {
      target.classList.remove('tour-target');
    }

    // Remove o clone
    const clone = document.querySelector('.tour-target-clone');
    if (clone) {
      clone.remove();
    }

    isTourStarted.value = false;
    currentStep.value = 0;
    highlightPosition.value = null;
    emit('tourComplete');

    if (props.tourKey) {
      localStorage.setItem(props.tourKey, 'completed');
    }
  });
};

// Atualiza posição quando rolar ou redimensionar a tela
const updatePositions = () => {
  if (isTourStarted.value) {
    nextTick(() => {
      updateHighlightPosition();
    });
  }
};

// Verifica se deve iniciar automaticamente
onMounted(() => {
  window.addEventListener('scroll', updatePositions);
  window.addEventListener('resize', updatePositions);

  if (props.autoStart && props.tourKey) {
    const tourCompleted = localStorage.getItem(props.tourKey) === 'completed';
    if (!tourCompleted) {
      startTour();
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', updatePositions);
  window.removeEventListener('resize', updatePositions);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.highlight-enter-active,
.highlight-leave-active {
  transition: all 0.3s ease;
}

.highlight-enter-from,
.highlight-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

:global(.tour-target) {
  position: relative;
  z-index: 1000 !important;
  background-color: white;
  opacity: 1;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

:global(.tour-target-pre) {
  position: relative;
  z-index: 1000 !important;
  background-color: transparent;
  opacity: 0;
}

:global(.tour-target-clone) {
  position: fixed;
  z-index: 1000 !important;
  background-color: white;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 0 2px #3b82f6;
}
</style> 