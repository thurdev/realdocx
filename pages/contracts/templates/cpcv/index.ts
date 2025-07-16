// Extra
import StepRGPDClause from "./StepRGPD.vue";
import StepInterventionClause from "./clauses/StepInterventionClause.vue";

export const clauses = [
  {
    name: "contracts.clauses.rgpd.title",
    description: "contracts.clauses.rgpd.description",
    html: "<h3>Proteção de Dados Pessoais:</h3><p>Os dados pessoais dos intervenientes serão tratados de acordo com a legislação em vigor.</p>",
    component: markRaw(StepRGPDClause),
    order: 1,
  },
  {
    name: "contracts.clauses.intervention.title",
    description: "contracts.clauses.intervention.description",
    html: "<h3>Intervenção Imobiliária:</h3><p>O imóvel objeto do presente contrato é o seguinte: {{property.address}}</p>",
    component: markRaw(StepInterventionClause),
    order: 2,
  },
];
