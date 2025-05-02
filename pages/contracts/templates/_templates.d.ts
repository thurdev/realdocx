export type ContractTemplate = {
  id: number;
  name: string;
  description: string;
  type: string;
  html: string;
  price: number;
  icon: string;
  objectsHtml: {
    seller: string;
    buyer: string;
  };
};

export type ContractResponse = {
  success?: boolean;
  error?: string;
  currentBalance?: number;
  requiredAmount?: number;
  status?: string;
};
