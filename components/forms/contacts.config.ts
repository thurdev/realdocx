export enum MaritalStatus {
  Single = "single",
  Married = "married",
  Divorced = "divorced",
  Widowed = "widowed",
}

export enum MarriageRegime {
  CommunityOfGoods = "communityOfGoods",
  SeparationOfGoods = "separationOfGoods",
  CommunityOfAcquests = "communityOfAcquests",
}

export enum ContactType {
  Individual = "individual",
  Company = "company",
}

export const maritalStatusData = ref([
  {
    value: MaritalStatus.Single,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.single",
  },
  {
    value: MaritalStatus.Married,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.married",
  },
  {
    value: MaritalStatus.Divorced,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.divorced",
  },
  {
    value: MaritalStatus.Widowed,
    label: "cpcv.contacts.modals.form.inputs.maritalStatus.widowed",
  },
]);

export const marriedUnderRegimeData = ref([
  {
    value: MarriageRegime.CommunityOfGoods,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.communityOfGoods",
  },
  {
    value: MarriageRegime.SeparationOfGoods,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.separationOfGoods",
  },
  {
    value: MarriageRegime.CommunityOfAcquests,
    label:
      "cpcv.contacts.modals.form.inputs.marriedUnderRegime.communityOfAcquests",
  },
]);
