import type { ContactType, ContractType } from "./_contract";

export type ContractContact = {
  contactId: number;
  contactType: ContactType;
};

export interface Contract {
  id: number;
  price: number;
  deposit: number;
  paymentMethod: string;
  contractType: ContractType;
  propertyId: number;
  generatedBy: string;
  htmlContent: string;
  templateId: number;
  duration?: number;
  rentDueDay?: number;
  property: {
    address: string;
    number: string;
    city: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractFormData {
  firstPartyId: number;
  secondPartyId: number;
  propertyId: number;
  price: number;
  deposit: number;
  paymentMethod: string;
  contractType: ContractType;
  templateId: number;
  duration?: number;
  rentDueDay?: number;
}
