export enum ContractType {
  CPCV = "sale",
  RENT = "rent"
}

export interface ContractStep {
  step: number;
  title: string;
  description: string;
}

export interface ContractParty {
  id?: number;
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
  type: ContractType;
  firstParty: ContractParty;
  secondParty: ContractParty;
  property: ContractProperty;
  price?: number;
  deposit?: number;
  paymentMethod?: string;
  contractDate?: string;
  contractDuration?: number;
  monthlyRent?: number;
  rentDueDay?: number;
  contractStartDate?: string;
} 