import type { Contact } from "../contacts/_contacts";
import type { Property } from "../properties/_property";

export enum ContactType {
  individual = "individual",
  company = "company"
}

export enum IdentityType {
  citizenCard = "citizenCard",
  oldIdCard = "oldIdCard",
  passport = "passport",
  drivingLicense = "drivingLicense",
  residencePermit = "residencePermit"
}

export enum MaritalStatus {
  single = "single",
  married = "married",
  divorced = "divorced",
  widowed = "widowed"
}

export enum ContractType {
  buyOrSell = "buyOrSell",
  rent = "rent"
}

export enum ContactsType {
  seller = "seller",
  buyer = "buyer",
  renter = "renter",
  landlord = "landlord"
}

export enum TransactionType {
  credit = "credit",
  debit = "debit"
}

interface ContractContact {
  id: number;
  contractId: number;
  contactId: number;
  contactType: ContactsType;
  contacts: Contact;
}

export interface Contract {
  id: number;
  price: number;
  contractType: ContractType;
  htmlContent?: string;
  contacts: ContractContact[];
  propertyId: number;
  property: Property;
  generatedBy: number;
  user?: {
    id: number;
    name?: string;
  };
}