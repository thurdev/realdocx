export enum MaritalStatus {
  Single = 'single',
  Married = 'married',
  Divorced = 'divorced',
  Widowed = 'widowed'
}

export enum MarriageRegime {
  CommunityOfGoods = 'communityOfGoods',
  SeparationOfGoods = 'separationOfGoods',
  CommunityOfAcquests = 'communityOfAcquests'
}

export enum CustomerType {
  Individual = 'individual',
  Company = 'company'
}

export const contactsRoutes = [
  {
    path: "/contacts",
    name: "contacts",
    component: () => import("./index.vue"),
  },
  {
    path: "/contacts/create",
    name: "contacts-create",
    component: () => import("./create.vue"),
  },
  {
    path: "/contacts/:id/edit",
    name: "contacts-edit",
    component: () => import("./edit.vue"),
  },
];
