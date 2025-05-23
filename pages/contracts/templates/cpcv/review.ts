import type { Contact } from "~/types/contacts";
import type { Property } from "~/types/properties";
import type { Clause } from "./CPCVForm.vue";
import type { ContractTemplate } from "../_templates";

export const generateContractHtml = (data: {
  selectedSeller: Contact[];
  selectedBuyer: Contact[];
  selectedProperty: Property;
  selectedClauses: Clause[];
  selectedTemplate: ContractTemplate;
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
    sellerHtml = sellerHtml.replace("{{seller.name}}", seller.name);
    sellerHtml = sellerHtml.replace("{{seller.vat}}", seller.vat);
    sellerHtml = sellerHtml.replace(
      "{{seller.maritalStatus}}",
      seller.maritalStatus
    );
    sellerHtml = sellerHtml.replace("{{seller.address}}", seller.address);
    // Add the seller html to the sellers html
    sellersHtml += sellerHtml;
  }
  sellersHtml += "</br>";
  // Replace the {{sellers}} placeholder with the sellers html
  html = html.replace("{{sellers}}", sellersHtml);

  // Do the same for the buyers
  let buyersHtml = "";
  for (const [index, buyer] of data.selectedBuyer.entries()) {
    let buyerHtml = `${index + 1}. `;
    buyerHtml += data.selectedTemplate.objectsHtml.buyer;
    buyerHtml = buyerHtml.replace("{{buyer.name}}", buyer.name);
    buyerHtml = buyerHtml.replace("{{buyer.vat}}", buyer.vat);
    buyerHtml = buyerHtml.replace(
      "{{buyer.maritalStatus}}",
      buyer.maritalStatus
    );
    buyerHtml = buyerHtml.replace("{{buyer.address}}", buyer.address);
    buyersHtml += buyerHtml + "</br>";
  }

  // Replace the {{buyers}} placeholder with the buyers html
  html = html.replace("{{buyers}}", buyersHtml);

  // Replace the property placeholder's with the property values
  html = html.replace("{{property.fraction}}", data.selectedProperty.fraction);
  html = html.replace("{{property.floor}}", data.selectedProperty.floor);
  html = html.replace(
    "{{property.destination}}",
    data.selectedProperty.destination
  );
  html = html.replace("{{property.address}}", data.selectedProperty.address);

  // Extra clauses
  data.selectedClauses
    .sort((a, b) => a.order - b.order)
    .forEach((clause) => {
      html += `<div>${clause.html}</div>`;
      const regex = new RegExp(`{{${clause.key}}}`, "g");
      html = html.replace(regex, clause.value);
    });

  return html;
};

// Funciton to get the first page of the contract
export function getFirstPageHtml(html: string): string {
  const marker = '<div class="page-break"></div>';
  const idx = html.indexOf(marker);
  if (idx === -1) return html;
  return html.substring(0, idx);
}
