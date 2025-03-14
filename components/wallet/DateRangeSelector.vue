<template>
  <div class="grid gap-2">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="outline" class="w-[300px] justify-start text-left font-normal">
          <CalendarIcon class="mr-2 h-4 w-4" />
          {{ formatDateRange }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0">
        <RangeCalendar
          v-model="dateRange"
          :initialFocus="true"
          class="rounded-md border"
          @update:model-value="handleDateChange"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DateRange } from '@internationalized/date';
import { getLocalTimeZone, today, parseDate } from '@internationalized/date';
import { CalendarIcon } from '@heroicons/vue/24/outline';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RangeCalendar } from '@/components/ui/range-calendar';

const props = defineProps<{
  modelValue: {
    startDate: Date;
    endDate: Date;
  };
}>();

const emit = defineEmits<{
  'update:modelValue': [value: { startDate: Date; endDate: Date }];
}>();

// Converter as datas do JavaScript para o formato do @internationalized/date
const toCalendarDate = (date: Date) => {
  const [year, month, day] = date.toISOString().split('T')[0].split('-');
  return parseDate(`${year}-${month}-${day}`);
};

// Inicializar o dateRange com as datas fornecidas
const dateRange = ref<DateRange>({
  start: toCalendarDate(props.modelValue.startDate),
  end: toCalendarDate(props.modelValue.endDate),
});

// Formatar a exibição do intervalo de datas
const formatDateRange = computed(() => {
  const start = props.modelValue.startDate.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const end = props.modelValue.endDate.toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${start} - ${end}`;
});

// Manipular mudanças nas datas
const handleDateChange = (range: DateRange) => {
  if (range.start && range.end) {
    emit('update:modelValue', {
      startDate: new Date(range.start.toString()),
      endDate: new Date(range.end.toString()),
    });
  }
};
</script> 