export interface Contact {
  id?: number;
  name: string;
  vat: string;
  image?: string;
  maritalStatus: string;
  marriedUnderRegime: string;
  identityType: string;
  identityNumber: string;
  identityExpirationDate: string;
  identityIssuer: string;
  country: string;
  address: string;
  neighborhood: string;
  state: string;
  city: string;
  zipCode: string;
  companyRegistration: string;
  companyCode: string;
  companyRCBECode: string;
  companySocialCapital: string;
  contactType: string;
  createdAt?: string;
  updatedAt?: string;
}
