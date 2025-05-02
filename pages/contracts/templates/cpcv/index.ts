// Extra
import StepDepositClause from "./clauses/StepDepositClause.vue";
import StepDeedDeadlineClause from "./clauses/StepDeedDeadlineClause.vue";
import StepFinancingClause from "./clauses/StepFinancingClause.vue";
import StepExpensesClause from "./clauses/StepExpensesClause.vue";
import StepOnusClause from "./clauses/StepOnusClause.vue";
import StepPenaltyClause from "./clauses/StepPenaltyClause.vue";

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
    name: "contracts.clauses.deed-deadline.title",
    description: "contracts.clauses.deed-deadline.description",
    html: "<h3>Prazo para Escritura:</h3><p>A escritura deverá ser realizada até {{extra-clause-deed-deadline-date}}.</p>",
    component: markRaw(StepDeedDeadlineClause),
    order: 2,
  },
  {
    name: "contracts.clauses.financing.title",
    description: "contracts.clauses.financing.description",
    html: "<h3>Condição de Financiamento:</h3><p>O contrato está condicionado à aprovação de financiamento até {{extra-clause-financing-deadline}}.</p>",
    component: markRaw(StepFinancingClause),
    order: 3,
  },
  {
    name: "contracts.clauses.expenses.title",
    description: "contracts.clauses.expenses.description",
    html: "<h3>Encargos Associados:</h3><p>As despesas com escritura e registos serão suportadas por {{extra-clause-expenses-party}}.</p>",
    component: markRaw(StepExpensesClause),
    order: 4,
  },
  {
    name: "contracts.clauses.onus.title",
    description: "contracts.clauses.onus.description",
    html: "<h3>Estado Livre de Ônus:</h3><p>O imóvel será entregue livre de quaisquer ônus ou encargos até à data da escritura.</p>",
    component: markRaw(StepOnusClause),
    order: 5,
  },
  {
    name: "contracts.clauses.penalty.title",
    description: "contracts.clauses.penalty.description",
    html: "<h3>Multa por Incumprimento:</h3><p>Em caso de incumprimento por parte do {{extra-clause-penalty-party}}, será devida uma penalização de {{extra-clause-penalty-amount}} euros.</p>",
    component: markRaw(StepPenaltyClause),
    order: 6,
  },
];
