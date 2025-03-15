<template>
  <div>
    <Button
      v-if="!isTourStarted"
      variant="info"
      class="fixed bottom-4 right-4 z-50"
      @click="startTour"
    >
      <HelpCircle class="mr-2 h-4 w-4" />
      Tutorial
    </Button>

    <!-- Overlay e conteúdo do tour -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isTourStarted" class="fixed inset-0 isolate" style="z-index: 60;">
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
                zIndex: 61,
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
            zIndex: 63,
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
import TourTooltip from './TourTooltip.vue';

const isTourStarted = ref(false);
const currentStep = ref(0);
const highlightPosition = ref<{ top: number; left: number; width: number; height: number } | null>(null);

const steps = [
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

const updateHighlightPosition = () => {
  // Remove a classe do elemento anterior
  const previousTarget = document.querySelector('.tour-target');
  if (previousTarget) {
    previousTarget.classList.remove('tour-target');
  }

  const step = steps[currentStep.value];
  if (!step) {
    highlightPosition.value = null;
    return;
  }

  const target = document.querySelector(step.target);
  if (!target) {
    highlightPosition.value = null;
    return;
  }

  // Atualiza a posição do highlight imediatamente
  const rect = target.getBoundingClientRect();
  highlightPosition.value = {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };

  // Adiciona primeiro a classe intermediária
  target.classList.add('tour-target-pre');
  
  // Depois adiciona a classe final com delay para criar o efeito de fade
  setTimeout(() => {
    target.classList.remove('tour-target-pre');
    target.classList.add('tour-target');
  }, 100);
};

const tooltipStyles = computed(() => {
  const step = steps[currentStep.value];
  if (!step) return {};

  const target = document.querySelector(step.target);
  if (!target) return {};

  const rect = target.getBoundingClientRect();
  const defaultOffset = 20;
  const bottomOffset = 10;
  const tooltipWidth = 350; // Largura do tooltip
  const windowWidth = window.innerWidth;

  let x = 0;
  let y = 0;

  switch (step.placement) {
    case 'bottom':
      x = rect.left + (rect.width / 2);
      // Ajusta para não ultrapassar as bordas
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
      break;
  }

  return {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
    transform: 'translate(-50%, 0)',
    zIndex: 1000,
  };
});

const currentStepContent = computed(() => steps[currentStep.value]?.content || '');

const isLastStep = computed(() => currentStep.value === steps.length - 1);

const startTour = () => {
  isTourStarted.value = true;
  currentStep.value = 0;
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
    // Remove a classe do elemento alvo ao finalizar
    const target = document.querySelector('.tour-target');
    if (target) {
      target.classList.remove('tour-target');
    }

    isTourStarted.value = false;
    currentStep.value = 0;
    highlightPosition.value = null;
  });
};

watch(isTourStarted, (newValue) => {
  if (!newValue) {
    currentStep.value = 0;
    highlightPosition.value = null;
  } else {
    nextTick(() => {
      updateHighlightPosition();
    });
  }
});

// Watch for step changes
watch(currentStep, () => {
  nextTick(() => {
    if (currentStep.value >= steps.length) {
      endTour();
      return;
    }
    const step = steps[currentStep.value];
    if (!step) {
      endTour();
      return;
    }
    updateHighlightPosition();
  });
});

// Update position on scroll and resize
const updatePositions = () => {
  if (isTourStarted.value) {
    nextTick(() => {
      updateHighlightPosition();
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', updatePositions);
  window.addEventListener('resize', updatePositions);
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

.tour-tooltip {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 16px;
  max-width: 300px;
}

/* Estilo para elevar o elemento alvo */
:global(.tour-target) {
  position: relative;
  z-index: 62 !important;
  background-color: white;
  opacity: 1;
  transition: opacity 0.3s ease, background-color 0.3s ease;
}

:global(.tour-target-pre) {
  position: relative;
  z-index: 62 !important;
  background-color: transparent;
  opacity: 0;
}

:global(.tour-target-enter-active),
:global(.tour-target-leave-active) {
  transition: all 0.3s ease;
}

:global(.tour-target-enter-from),
:global(.tour-target-leave-to) {
  opacity: 0;
  transform: scale(0.95);
}
</style> 