<template>
  <div class="space-y-6">
    <!-- Preview do texto gerado -->
    <div v-if="notificationsText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <div class="text-sm leading-relaxed space-y-4">
        <p><strong>1.</strong> {{ notificationsText.first }}</p>
        <p><strong>2.</strong> {{ notificationsText.second }}</p>
        <p><strong>3.</strong> {{ notificationsText.third }}</p>
        <p><strong>4.</strong> {{ notificationsText.fourth }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Computed para gerar o texto de notificações
const notificationsText = computed(() => {
  return {
    first: `As comunicações escritas entre os Outorgantes serão efectuadas por carta registada com aviso de recepção para as moradas indicadas no preâmbulo do presente Contrato Promessa ou, em alternativa, por correio electrónico desde que sejam enviadas com recibo de entrega e leitura para os respectivos endereços electrónicos facultados pelos Outorgantes por ocasião do presente Contrato Promessa.`,

    second: `Se a carta não for reclamada, poderá o remetente da mesma dirigir uma carta subsequente por correio simples registado, bem como por correio electrónico para os respectivos endereços electrónicos, considerando-se a notificação efectuada no terceiro dia útil posterior ao desse envio.`,

    third: `Os Outorgantes obrigam-se a comunicar por escrito, reciprocamente, eventuais alterações dos respectivos contactos.`,

    fourth: `A forma de comunicação entre os Outorgantes estabelecida nos números anteriores não prejudica que, por acordo, os mesmos privilegiem a comunicação por contacto telefónico, por correio electrónico, ou por intermédio de Consultor Imobiliário.`,
  };
});

// Watch para emitir o texto gerado
watch(
  [notificationsText],
  ([newNotificationsText]) => {
    // Emit para o texto completo de notificações
    emit("on-auto-handle-step", {
      name: "notifications",
      key: "notifications",
      html: `${newNotificationsText.first} ${newNotificationsText.second} ${newNotificationsText.third} ${newNotificationsText.fourth}`,
    });
  },
  { immediate: true }
);
</script>
