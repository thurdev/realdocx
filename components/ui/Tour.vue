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
        <div v-if="isTourStarted" class="fixed inset-0" style="z-index: 40;">
          <!-- Overlay escuro -->
          <div class="fixed inset-0 bg-black/50 transition-opacity duration-300" style="z-index: 40" />

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
                zIndex: 50,
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
            zIndex: 60,
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
  placement: 'top' | 'bottom' | 'left' | 'right' | 'bottom-right';
  class?: string;
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
  (e: 'stepNext', step: number): void;
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
    previousTarget.style.visibility = 'visible';
    previousTarget.style.pointerEvents = 'auto';
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

  // Esconde o elemento original e desativa interações
  target.style.visibility = 'hidden';
  target.style.pointerEvents = 'none';
  target.classList.add('tour-target');
  if (step.class) {
    target.classList.add(step.class);
  }

  // Cria um clone do elemento alvo
  const clone = target.cloneNode(true) as HTMLElement;
  
  // Mantém as classes originais para preservar estilos
  const originalClasses = target.className.split(' ').filter(c => c !== 'tour-target');
  clone.className = [...originalClasses, 'tour-target-clone'].join(' ');
  
  // Posiciona o clone exatamente sobre o original e desativa interações
  Object.assign(clone.style, {
    position: 'fixed',
    top: rect.top + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
    zIndex: '51',
    pointerEvents: 'none',
    cursor: 'default',
    visibility: 'visible',
    userSelect: 'none',
    transition: 'none'
  });

  // Remove event listeners e hover states
  clone.removeAttribute('onclick');
  clone.removeAttribute('onmouseover');
  clone.removeAttribute('onmouseenter');
  clone.removeAttribute('onmouseleave');
  
  // Adiciona o clone ao body
  document.body.appendChild(clone);
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

  // Verifica se o elemento está dentro de um dialog
  const dialogContent = target.closest('.dialog-content');
  const isInDialog = !!dialogContent;

  switch (step.placement) {
    case 'bottom':
      x = rect.left + (rect.width / 2);
      x = Math.min(Math.max(tooltipWidth / 2, x), windowWidth - tooltipWidth / 2);
      y = rect.bottom + bottomOffset;
      if (isInDialog) {
        const dialogRect = dialogContent.getBoundingClientRect();
        y = Math.min(y, dialogRect.bottom + bottomOffset);
      }
      break;
    case 'top':
      x = rect.left + (rect.width / 2);
      x = Math.min(Math.max(tooltipWidth / 2, x), windowWidth - tooltipWidth / 2);
      y = rect.top - defaultOffset;
      if (isInDialog) {
        const dialogRect = dialogContent.getBoundingClientRect();
        y = Math.max(y, dialogRect.top - defaultOffset);
      }
      break;
    case 'left':
      x = rect.left - defaultOffset;
      y = rect.top + (rect.height / 2);
      break;
    case 'right':
      x = rect.right + defaultOffset;
      y = rect.top + (rect.height / 2);
      break;
    case 'bottom-right':
      x = rect.right + defaultOffset;
      y = rect.bottom + bottomOffset;
      break;
  }

  return {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translate(-50%, 0)',
    pointerEvents: 'auto', // Garante que o tooltip seja clicável
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
  emit('stepNext', currentStep.value);
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
    // Remove a classe do elemento alvo e restaura sua visibilidade
    const target = document.querySelector('.tour-target');
    if (target) {
      target.classList.remove('tour-target');
      target.style.visibility = 'visible';
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
  z-index: 50 !important;
  opacity: 0;
  visibility: hidden !important;
  pointer-events: none !important;
  user-select: none !important;
  transition: none !important;
}

:global(.tour-target-pre) {
  position: relative;
  z-index: 50 !important;
  opacity: 0;
  visibility: hidden !important;
  pointer-events: none !important;
}

:global(.tour-target-clone) {
  position: fixed !important;
  z-index: 51 !important;
  transition: none !important;
  pointer-events: none !important;
  user-select: none !important;
  visibility: visible !important;
  opacity: 1 !important;
  border-radius: inherit !important;
}

:global(.tour-container) {
  isolation: isolate;
}

:global(.tour-tooltip) {
  pointer-events: auto !important;
  cursor: pointer !important;
  user-select: text !important;
}
</style> 