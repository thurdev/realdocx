import { CustomerType } from '@/types/customer';

export const getContactSteps = (type: CustomerType) => {
  const steps = [
    {
      title: 'Dados Pessoais',
      description: 'Informações básicas do contato'
    },
    {
      title: 'Endereço',
      description: 'Informações de endereço'
    },
    {
      title: 'Documento',
      description: 'Documento de identificação'
    }
  ];

  if (type === CustomerType.Company) {
    steps.push({
      title: 'Dados da Empresa',
      description: 'Informações da empresa'
    });
  }

  return steps;
}; 