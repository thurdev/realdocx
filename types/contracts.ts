import { ContractType } from '@prisma/client'

export interface ContractStep {
  step: number;
  title: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
}

export interface ContractTemplate {
  id: number;
  name: string;
  description?: string;
  type: ContractType;
  html: string;
  price: number;
  isActive: boolean;
  steps: ContractStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractParty {
  id: number;
  name: string;
  vat: string;
  maritalStatus: string;
  address: string;
}

export interface ContractProperty {
  id: number;
  fraction: string;
  floor: string;
  destination: string;
  address: string;
  city: string;
  neighborhood: string;
  number: string;
  postalCode: string;
}

export interface ContractDetails {
  price: number;
  contractType: ContractType;
  propertyId: number;
  firstPartyId: number;
  secondPartyId: number;
  templateId: number;
  htmlContent: string;
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
} 