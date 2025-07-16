import type { Contact } from "~/pages/contacts/_contacts";
import type { Property } from "~/pages/properties/_property";
import type { Clause } from "./CPCVForm.vue";
import type { ContractTemplate } from "../_templates";

const IndetityType: Record<string, string> = {
  citizenCard: "Cartão de Cidadão",
  oldIdCard: "Cartão de Identidade",
  passport: "Passaporte",
  drivingLicense: "Carta de Condução",
  residencePermit: "Permissão de Residência",
};

export const generateContractHtml = (data: {
  selectedSeller: Contact[];
  selectedBuyer: Contact[];
  selectedProperty: Partial<Property>;
  selectedClauses: Clause[];
  selectedTemplate: ContractTemplate;
  autoHandleSteps: { name: string; key: string; html: string }[];
}): string => {
  if (
    data.selectedBuyer.length === 0 ||
    data.selectedSeller.length === 0 ||
    data.selectedProperty === undefined ||
    data.selectedTemplate === undefined
  ) {
    return "";
  }

  let html = data.selectedTemplate.html;

  let sellersHtml = "";

  // First we loop thorugh the sellers
  for (const [index, seller] of data.selectedSeller.entries()) {
    let sellerHtml = `${index + 1}. `;
    sellerHtml += data.selectedTemplate.objectsHtml.seller;
    // Replace the placeholders with the actual values
    sellerHtml = sellerHtml.replace(
      "{{ seller.name }}",
      seller.name ??
        '<span style="background-color: orange;">{{ seller.name }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.district }}",
      seller.district ??
        '<span style="background-color: orange;">{{ seller.district }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.city }}",
      seller.city ??
        '<span style="background-color: orange;">{{ seller.city }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.district }}",
      seller.district ??
        '<span style="background-color: orange;">{{ seller.district }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.vat }}",
      seller.vat ??
        '<span style="background-color: orange;">{{ seller.vat }}</span>'
    );

    sellerHtml = sellerHtml.replace(
      "{{ seller.identityType }}",
      IndetityType[seller.identityType] ??
        '<span style="background-color: orange;">{{ seller.identityType }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.identityNumber }}",
      seller.identityNumber ??
        '<span style="background-color: orange;">{{ seller.identityNumber }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.identityIssuer }}",
      seller.identityIssuer ??
        '<span style="background-color: orange;">{{ seller.identityIssuer }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.identityExpirationDate }}",
      seller.identityExpirationDate
        ? new Date(seller.identityExpirationDate).toLocaleDateString()
        : '<span style="background-color: orange;">{{ seller.identityExpirationDate }}</span>'
    );
    sellerHtml = sellerHtml.replace(
      "{{ seller.address }}",
      seller.address +
        ", " +
        (seller.zipCode ??
          '<span style="background-color: orange;">{{ seller.zipCode }}</span>') +
        ", " +
        (seller.neighborhood ??
          '<span style="background-color: orange;">{{ seller.neighborhood }}</span>') +
        ", " +
        (seller.city ??
          '<span style="background-color: orange;">{{ seller.city }}</span>') +
        ", " +
        (seller.state ??
          '<span style="background-color: orange;">{{ seller.state }}</span>') +
        ", " +
        (seller.country ??
          '<span style="background-color: orange;">{{ seller.country }}</span>')
    );

    // Add the seller html to the sellers html
    sellersHtml += sellerHtml;
  }
  sellersHtml += "</br>";
  // Replace the {{ sellers }} placeholder with the sellers html
  html = html.replace("{{ sellers }}", sellersHtml);

  // Do the same for the buyers
  let buyersHtml = "";
  for (const [index, buyer] of data.selectedBuyer.entries()) {
    let buyerHtml = `${index + 1}. `;
    buyerHtml += data.selectedTemplate.objectsHtml.buyer;
    buyerHtml = buyerHtml.replace(
      "{{ buyer.name }}",
      buyer.name ??
        '<span style="background-color: orange;">{{ buyer.name }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.district }}",
      buyer.district ??
        '<span style="background-color: orange;">{{ buyer.district }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.city }}",
      buyer.city ??
        '<span style="background-color: orange;">{{ buyer.city }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.district }}",
      buyer.district ??
        '<span style="background-color: orange;">{{ buyer.district }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.vat }}",
      buyer.vat ??
        '<span style="background-color: orange;">{{ buyer.vat }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.identityType }}",
      IndetityType[buyer.identityType] ??
        '<span style="background-color: orange;">{{ buyer.identityType }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.identityNumber }}",
      buyer.identityNumber ??
        '<span style="background-color: orange;">{{ buyer.identityNumber }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.identityIssuer }}",
      buyer.identityIssuer ??
        '<span style="background-color: orange;">{{ buyer.identityIssuer }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.identityExpirationDate }}",
      buyer.identityExpirationDate
        ? new Date(buyer.identityExpirationDate).toLocaleDateString()
        : '<span style="background-color: orange;">{{ buyer.identityExpirationDate }}</span>'
    );
    buyerHtml = buyerHtml.replace(
      "{{ buyer.address }}",
      buyer.address +
        ", " +
        (buyer.zipCode ??
          '<span style="background-color: orange;">{{ buyer.zipCode }}</span>') +
        ", " +
        (buyer.neighborhood ??
          '<span style="background-color: orange;">{{ buyer.neighborhood }}</span>') +
        ", " +
        (buyer.city ??
          '<span style="background-color: orange;">{{ buyer.city }}</span>') +
        ", " +
        (buyer.state ??
          '<span style="background-color: orange;">{{ buyer.state }}</span>') +
        ", " +
        (buyer.country ??
          '<span style="background-color: orange;">{{ buyer.country }}</span>')
    );
    buyersHtml += buyerHtml + "</br>";
  }

  // Replace the {{ buyers }} placeholder with the buyers html
  html = html.replace("{{ buyers }}", buyersHtml);

  // Replace the property placeholder's with the property values
  html = html.replace(
    "{{ property.fraction }}",
    data.selectedProperty.fraction ??
      '<span style="background-color: orange;">{{ property.fraction }}</span>'
  );
  html = html.replace(
    "{{ property.floor }}",
    data.selectedProperty.floor ??
      '<span style="background-color: orange;">{{ property.floor }}</span>'
  );
  html = html.replace(
    "{{ property.side }}",
    data.selectedProperty.side ??
      '<span style="background-color: orange;">{{ property.side }}</span>'
  );
  html = html.replace(
    "{{ property.destination }}",
    data.selectedProperty.destination ??
      '<span style="background-color: orange;">{{ property.destination }}</span>'
  );
  html = html.replace(
    "{{ property.address }}",
    (data.selectedProperty.address ??
      '<span style="background-color: orange;">{{ property.address }}</span>') +
      ", " +
      (data.selectedProperty.postalCode ??
        '<span style="background-color: orange;">{{ property.postalCode }}</span>') +
      ", " +
      (data.selectedProperty.neighborhood ??
        '<span style="background-color: orange;">{{ property.neighborhood }}</span>') +
      ", " +
      (data.selectedProperty.city ??
        '<span style="background-color: orange;">{{ property.city }}</span>') +
      ", " +
      (data.selectedProperty.district ??
        '<span style="background-color: orange;">{{ property.district }}</span>') +
      ", " +
      (data.selectedProperty.country ??
        '<span style="background-color: orange;">{{ property.country }}</span>')
  );
  html = html.replace(
    "{{ property.matrixRegistration }}",
    data.selectedProperty.matrixRegistration ??
      '<span style="background-color: orange;">{{ property.matrixRegistration }}</span>'
  );
  html = html.replace(
    "{{ property.neighborhoodMatrixRegistration }}",
    data.selectedProperty.neighborhoodMatrixRegistration ??
      '<span style="background-color: orange;">{{ property.neighborhoodMatrixRegistration }}</span>'
  );
  html = html.replace(
    "{{ property.description }}",
    data.selectedProperty.description ??
      '<span style="background-color: orange;">{{ property.description }}</span>'
  );
  html = html.replace(
    "{{ property.luNumber }}",
    data.selectedProperty.luNumber ??
      '<span style="background-color: orange;">{{ property.luNumber }}</span>'
  );
  html = html.replace(
    "{{ property.luDate }}",
    data.selectedProperty.luDate ??
      '<span style="background-color: orange;">{{ property.luDate }}</span>'
  );
  html = html.replace(
    "{{ property.luIssuer }}",
    data.selectedProperty.luIssuer ??
      '<span style="background-color: orange;">{{ property.luIssuer }}</span>'
  );
  html = html.replace(
    "{{ property.ecNumber }}",
    data.selectedProperty.ecNumber ??
      '<span style="background-color: orange;">{{ property.ecNumber }}</span>'
  );
  html = html.replace(
    "{{ property.ecValidUntil }}",
    data.selectedProperty.ecValidUntil ??
      '<span style="background-color: orange;">{{ property.ecValidUntil }}</span>'
  );
  html = html.replace(
    "{{ property.ecLetter }}",
    data.selectedProperty.ecLetter ??
      '<span style="background-color: orange;">{{ property.ecLetter }}</span>'
  );
  // TODO:  Vai vir dos steps
  //html = html.replace("{{ property.onus }}", data.selectedProperty.onus);

  // Extra clauses
  data.selectedClauses
    .sort((a, b) => a.order - b.order)
    .forEach((clause) => {
      html += `${clause.html}`;
      const regex = new RegExp(`{{ ${clause.key} }}`, "g");
      html = html.replace(regex, clause.value);
    });

  // Auto handle steps
  data.autoHandleSteps.forEach((step) => {
    const regex = new RegExp(`{{ ${step.key} }}`, "g");
    html = html.replace(
      regex,
      step.html ??
        `<span style="background-color: orange;">{{ ${step.key} }}</span>`
    );
  });

  return html;
};

// Funciton to get the first page of the contract
export function getFirstPageHtml(html: string): string {
  const marker = "<div class='page-break'></div>";
  const idx = html.indexOf(marker);
  if (idx === -1) return html;
  return html.substring(0, idx);
}
