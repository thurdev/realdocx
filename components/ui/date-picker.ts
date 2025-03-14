import { defineComponent } from 'vue';

export const DatePicker = defineComponent({
  name: 'DatePicker',
  props: {
    modelValue: {
      type: Date,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      emit('update:modelValue', new Date(target.value));
    };

    return () => (
      <input
        type="date"
        value={props.modelValue.toISOString().split('T')[0]}
        onInput={handleInput}
        class="px-3 py-2 border rounded-md text-sm"
      />
    );
  },
}); 