export { default as Step01Objects } from "./Step01-Objects.vue";
export { default as Step02Properties } from "./Step02-Properties.vue";
export { default as Step03ExtraClause } from "./Step03-ExtraClause.vue";
export { default as Step04Review } from "./Step04-Review.vue";

// Extra
import StepDepositClause from "./clauses/StepDepositClause.vue";

export const clauses = [
  {
    name: "contracts.clauses.deposit.title",
    description: "contracts.clauses.deposit.description",
    html: "<h3>Deposit Clause:</h3><p>{{extra-clause-deposit-value}}</p>",
    component: markRaw(StepDepositClause),
    // When rendering the html it should be sorted by this order
    order: 1,
  },
  {
    name: "contracts.clauses.deposit.title2",
    description: "contracts.clauses.deposit.description",
    html: "<h3>Deposit Clause:</h3><p>{{extra-clause-deposit-value}}</p>",
    component: markRaw(StepDepositClause),
    // When rendering the html it should be sorted by this order
    order: 1,
  },
  {
    name: "contracts.clauses.deposit.title3",
    description: "contracts.clauses.deposit.description",
    html: "<h3>Deposit Clause:</h3><p>{{extra-clause-deposit-value}}</p>",
    component: markRaw(StepDepositClause),
    // When rendering the html it should be sorted by this order
    order: 1,
  },
  {
    name: "contracts.clauses.deposit.title4",
    description: "contracts.clauses.deposit.description",
    html: "<h3>Deposit Clause:</h3><p>{{extra-clause-deposit-value}}</p>",
    component: markRaw(StepDepositClause),
    // When rendering the html it should be sorted by this order
    order: 1,
  },
  {
    name: "contracts.clauses.deposit.title5",
    description: "contracts.clauses.deposit.description",
    html: "<h3>Deposit Clause:</h3><p>{{extra-clause-deposit-value}}</p>",
    component: markRaw(StepDepositClause),
    // When rendering the html it should be sorted by this order
    order: 1,
  },
];
