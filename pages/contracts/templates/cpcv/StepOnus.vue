<template>
  <div class="space-y-6">
    <!-- Seção de Ônus -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">Ônus sobre o imóvel</h3>
        <Button @click="addOnus" variant="outline" size="sm">
          <PlusIcon class="h-4 w-4 mr-2" />
          Adicionar Ônus
        </Button>
      </div>

      <!-- Lista de Ônus -->
      <div v-if="onus.length > 0" class="space-y-4">
        <div
          v-for="(onusItem, index) in onus"
          :key="index"
          class="border rounded-lg p-4 space-y-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-medium">Ônus {{ index + 1 }}</h4>
            <Button
              @click="removeOnus(index)"
              variant="ghost"
              size="sm"
              class="text-red-600 hover:text-red-700"
            >
              <TrashIcon class="h-4 w-4" />
            </Button>
          </div>

          <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
            <!-- Tipo de Ônus -->
            <div>
              <Label>Tipo de Ônus</Label>
              <Select v-model="onusItem.type">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hipoteca voluntária"
                    >Hipoteca Voluntária</SelectItem
                  >
                  <SelectItem value="penhora">Penhora</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <!-- Entidade -->
            <div>
              <Label>Entidade</Label>
              <Input
                v-model="onusItem.entity"
                placeholder="Ex: BANCO CAIXA GERAL DEPOSITOS, S.A"
              />
            </div>

            <!-- AP -->
            <div>
              <Label>AP (Ato de Publicação)</Label>
              <Input
                v-model="onusItem.ap"
                placeholder="Ex: AP. 81 de 1999/03/18"
              />
            </div>

            <!-- Valor (opcional) -->
            <div>
              <Label>Valor (opcional)</Label>
              <NumberField
                v-model="onusItem.amount"
                :default-value="0"
                :format-options="{ style: 'currency', currency: 'EUR' }"
              >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensagem quando não há ônus -->
      <div v-else class="text-center py-8 text-muted-foreground">
        <FileTextIcon class="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum ônus adicionado</p>
        <p class="text-sm">Clique em "Adicionar Ônus" para começar</p>
      </div>
    </div>

    <!-- Preview do texto gerado -->
    <div v-if="onusText" class="border rounded-lg p-4 bg-muted/50">
      <h4 class="font-medium mb-2">Preview do texto:</h4>
      <p class="text-sm leading-relaxed">{{ onusText }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon, FileTextIcon } from "lucide-vue-next";
import extenso from "extenso";

interface OnusItem {
  type: "hipoteca voluntária" | "penhora" | "outro";
  entity: string;
  ap: string;
  amount: number;
}

const onus = ref<OnusItem[]>([]);

const emit = defineEmits<{
  (
    e: "on-auto-handle-step",
    payload: { name: string; key: string; html: string }
  ): void;
}>();

// Função para adicionar novo ônus
const addOnus = () => {
  onus.value.push({
    type: "hipoteca voluntária",
    entity: "",
    ap: "",
    amount: 0,
  });
};

// Função para remover ônus
const removeOnus = (index: number) => {
  onus.value.splice(index, 1);
};

// Função para corrigir problemas gramaticais com números
const getCorrectedNumberText = (
  num: number,
  singular: string,
  plural: string
): string => {
  // Usar extenso com gender feminino para todos os números
  const words = extenso(num, {
    mode: "number",
    locale: "pt",
    number: { gender: "f" },
  });

  // Para singular (num === 1) usar singular, senão usar plural
  const wordForm = num === 1 ? singular : plural;
  return words.charAt(0).toUpperCase() + words.slice(1) + ` ${wordForm}`;
};

// Computed para gerar o texto dos ônus
const onusText = computed(() => {
  if (onus.value.length === 0) return "";

  const hipotecas = onus.value.filter((o) => o.type === "hipoteca voluntária");
  const penhoras = onus.value.filter((o) => o.type === "penhora");

  let text = "";

  // Processar hipotecas
  if (hipotecas.length > 0) {
    const hipotecasCount = hipotecas.length;
    const hipotecasText = getCorrectedNumberText(
      hipotecasCount,
      "hipoteca voluntária",
      "hipotecas voluntárias"
    );

    const aps = hipotecas.map((h) => h.ap).filter(Boolean);
    const apsText =
      aps.length > 0
        ? `registada${hipotecasCount > 1 ? "s" : ""} sob ${aps.join(", ")}`
        : "";

    const amounts = hipotecas.filter((h) => h.amount > 0);
    const amountsText =
      amounts.length > 0
        ? ` no valor de ${amounts
            .map((h) =>
              new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(h.amount)
            )
            .join(", ")}`
        : "";

    text += `${hipotecasText} a favor do ${hipotecas[0].entity}, ${apsText}${amountsText}`;
  }

  // Processar penhoras
  if (penhoras.length > 0) {
    if (text) text += ", e ";

    const penhorasCount = penhoras.length;
    const penhorasText = getCorrectedNumberText(
      penhorasCount,
      "penhora",
      "penhoras"
    );

    const aps = penhoras.map((p) => p.ap).filter(Boolean);
    const apsText =
      aps.length > 0
        ? `registada${penhorasCount > 1 ? "s" : ""} sob ${aps.join(", ")}`
        : "";

    const amounts = penhoras.filter((p) => p.amount > 0);
    const amountsText =
      amounts.length > 0
        ? ` no valor de ${amounts
            .map((p) =>
              new Intl.NumberFormat("pt-PT", {
                style: "currency",
                currency: "EUR",
              }).format(p.amount)
            )
            .join(", ")}`
        : "";

    text += `${penhorasText} a favor do ${penhoras[0].entity}., ${apsText}${amountsText}`;
  }

  // Adicionar texto final
  if (text) {
    text +=
      ", cujos cancelamentos serão assegurados pela Parte Vendedora, em simultâneo com o Contrato Definitivo de Compra e Venda.";
  }

  return text;
});

// Watch para emitir o texto gerado
watch(
  [onusText, onus],
  ([newText, newOnus]) => {
    if (newOnus.length === 0) {
      emit("on-auto-handle-step", {
        name: "onus",
        key: "onus",
        html: "o imóvel encontra-se livre de quaisquer ónus ou encargos.",
      });
      return;
    } else {
      emit("on-auto-handle-step", {
        name: "onus",
        key: "onus",
        html: newText,
      });
    }
  },
  { immediate: true }
);
</script>
