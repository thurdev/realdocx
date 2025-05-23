<template>
  <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
    <!-- Preço Total -->
    <div>
      <Label for="priceTotal">Preço total</Label>
      <NumberField
        id="priceTotal"
        v-model="priceTotal"
        :default-value="279900"
        :format-options="{ style: 'currency', currency: 'EUR' }"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>

    <!-- Valor de Reserva -->
    <div>
      <Label for="reserva">Valor de reserva</Label>
      <NumberField
        id="reserva"
        v-model="reserva"
        :default-value="2500"
        :format-options="{ style: 'currency', currency: 'EUR' }"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>

    <div>
      <!-- Data da Reserva -->
      <Label>Data da reserva</Label>
      <Popover>
        <PopoverTrigger as-child>
          <Button
            variant="outline"
            :class="
              cn(
                'w-full justify-start text-left font-normal',
                !dataReserva && 'text-muted-foreground'
              )
            "
          >
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{
              dataReserva
                ? df.format(dataReserva.toDate(getLocalTimeZone()))
                : "Selecione uma data"
            }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="dataReserva" initial-focus />
        </PopoverContent>
      </Popover>
    </div>

    <!-- Valor de sinal -->
    <div>
      <Label for="sinal">Valor de sinal</Label>
      <NumberField
        id="sinal"
        v-model="sinal"
        :default-value="25490"
        :format-options="{ style: 'currency', currency: 'EUR' }"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>

    <!-- Valor remanescente -->
    <div>
      <Label for="remanescente">Valor remanescente (na escritura)</Label>
      <NumberField
        id="remanescente"
        v-model="remanescente"
        :format-options="{ style: 'currency', currency: 'EUR' }"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>

    <!-- Forma de pagamento -->
    <div>
      <Label class="text-sm font-medium text-gray-700"
        >Forma de pagamento</Label
      >
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="IBAN"> Transferência Bancária </SelectItem>
            <SelectItem value="Cheque"> Cheque visado </SelectItem>
            <SelectItem value="MBWay"> MB Way </SelectItem>
            <SelectItem value="Outro"> Outro </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <!-- IBAN da Parte Compradora -->
    <div>
      <Label>IBAN Parte Compradora</Label>
      <Input type="text" v-model="ibanComprador" placeholder="PT50 0033..." />
    </div>

    <!-- IBAN da Parte Vendedora -->
    <div>
      <Label>IBAN Parte Vendedora</Label>
      <Input type="text" v-model="ibanVendedor" placeholder="PT50 0018..." />
    </div>

    <!-- Entidade Bancária (opcional) -->
    <div>
      <Label>Entidade Bancária (opcional)</Label>
      <Input
        type="text"
        v-model="entidadeReferencia"
        placeholder="Entidade / Referência se aplicável"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";
const df = new DateFormatter("en-US", {
  dateStyle: "long",
});
import { cn } from "@/lib/utils";

const priceTotal = ref(279900);
const reserva = ref(2500);
const dataReserva = ref<DateValue>();
const sinal = ref(25490);
const remanescente = ref(251910);
const formaPagamento = ref("transferencia");
const ibanComprador = ref("");
const ibanVendedor = ref("");
const entidadeReferencia = ref("");
</script>
