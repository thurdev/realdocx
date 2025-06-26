export type ContractTemplate = {
  id: number;
  name: string;
  description: string;
  type: string;
  html: string;
  price: number;
  downloadPrice: number;
  isActive: boolean;
  icon: string;
  objectsHtml: {
    seller: string;
    buyer: string;
  };
  clausules: {
    name: string;
    description: string;
    fields: {
      name: {
        pt: string;
        en: string;
      };
      type: string;
    }[];
  }[];
  steps: {
    step: number;
    title: {
      pt: string;
      en: string;
    };
    description: {
      pt: string;
      en: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
};

export type ContractResponse = {
  success?: boolean;
  error?: string;
  currentBalance?: number;
  requiredAmount?: number;
  status?: string;
};
