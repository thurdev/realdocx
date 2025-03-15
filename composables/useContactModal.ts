import { ref } from 'vue';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  type: string;
}

export function useContactModal() {
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const form = ref<ContactForm>({
    name: '',
    email: '',
    phone: '',
    type: ''
  });

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
    resetForm();
  };

  const resetForm = () => {
    form.value = {
      name: '',
      email: '',
      phone: '',
      type: ''
    };
    isEditing.value = false;
  };

  const handleSubmit = async () => {
    try {
      // Aqui você implementará a lógica de submissão do formulário
      // Por exemplo, chamar uma API para criar/atualizar o contato
      
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
    }
  };

  return {
    isModalOpen,
    isEditing,
    form,
    openModal,
    closeModal,
    handleSubmit
  };
} 