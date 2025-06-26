<template>
  <div class="flex flex-col flex-1 gap-4">
    <div class="space-y-2">
      <Label>Forma de Notificação</Label>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <Checkbox
            id="registeredMail"
            v-model="notifications.registeredMail"
          />
          <label for="registeredMail" class="text-sm">Carta registada</label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="email" v-model="notifications.email" />
          <label for="email" class="text-sm"
            >Correio electrónico com recibo de leitura</label
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Checkbox } from "@/components/ui/checkbox";

const notifications = ref({
  registeredMail: true,
  email: false,
});

const emit = defineEmits<{
  (
    e: "on-extra-clause-value",
    payload: { key: string; value: string; html: string }
  ): void;
}>();

watch(
  notifications,
  (newNotifications) => {
    const notificationsText = Object.entries(newNotifications)
      .filter(([_, value]) => value)
      .map(([key]) => {
        switch (key) {
          case "registeredMail":
            return "carta registada";
          case "email":
            return "correio electrónico com recibo de leitura";
          default:
            return "";
        }
      })
      .filter(Boolean)
      .join(" ou por ");

    // Se não houver nenhuma notificação selecionada, não emitimos o evento
    if (!notificationsText) {
      emit("on-extra-clause-value", {
        key: "notifications",
        value: "",
        html: "",
      });
      return;
    }

    emit("on-extra-clause-value", {
      key: "notifications",
      value: notificationsText,
      html: `<h2>9.º Cláusula (Notificações)</h2><p>As comunicações entre os Outorgantes serão efectuadas por ${notificationsText}.</p>`,
    });
  },
  { immediate: true }
);
</script>
