import { ContactType, ContractType } from "@prisma/client";

export type ContractContact = {
  contactId: number;
  contactType: ContactType;
};

export type Contract = {
  price: number;
  contractType: ContractType;
  propertyId: number;
  generatedBy: number;
  contacts: ContractContact[];
  createdAt: string;
};
