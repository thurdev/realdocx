import { MaritalStatus, MarriedUnderRegime } from '@/types/customer';

export const maritalStatusOptions = [
  { value: MaritalStatus.Single, label: 'Solteiro(a)' },
  { value: MaritalStatus.Married, label: 'Casado(a)' },
  { value: MaritalStatus.Divorced, label: 'Divorciado(a)' },
  { value: MaritalStatus.Widowed, label: 'Viúvo(a)' },
  { value: MaritalStatus.Separated, label: 'Separado(a)' }
];

export const marriedUnderRegimeOptions = [
  { value: MarriedUnderRegime.CommunityProperty, label: 'Comunhão Universal de Bens' },
  { value: MarriedUnderRegime.SeparateProperty, label: 'Separação Total de Bens' },
  { value: MarriedUnderRegime.PartialCommunity, label: 'Comunhão Parcial de Bens' }
];

export const countryOptions = [
  { value: 'BR', label: 'Brasil' },
  { value: 'PT', label: 'Portugal' },
  { value: 'US', label: 'Estados Unidos' },
  { value: 'ES', label: 'Espanha' },
  { value: 'FR', label: 'França' }
];

export const identityTypeOptions = [
  { value: 'citizenCard', label: 'Cartão de Cidadão' },
  { value: 'oldIdCard', label: 'Bilhete de Identidade' },
  { value: 'passport', label: 'Passaporte' },
  { value: 'drivingLicense', label: 'Carta de Condução' },
  { value: 'residencePermit', label: 'Autorização de Residência' }
]; 