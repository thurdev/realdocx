export enum CustomerType {
  Individual = 'individual',
  Company = 'company'
}

export enum MaritalStatus {
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed',
  Separated = 'separated'
}

export enum MarriedUnderRegime {
  CommunityProperty = 'communityProperty',
  SeparateProperty = 'separateProperty',
  PartialCommunity = 'partialCommunity'
}

export interface Customer {
  id?: string;
  contactType: CustomerType;
  name: string;
  vat: string;
  maritalStatus?: MaritalStatus;
  marriedUnderRegime?: MarriedUnderRegime;
  country: string;
  address: string;
  city: string;
  zipCode: string;
  identityType: string;
  identityNumber: string;
  identityExpirationDate: string;
  identityIssuer: string;
  companyRegistration?: string;
  companyCode?: string;
  companyRCBECode?: string;
  companySocialCapital?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 