import type { Contact } from "~/pages/contacts/_contacts";
import type { Property } from "~/pages/properties/_property";
import { ContractType } from "~/pages/contracts/_contract";

interface ContractData {
  type: ContractType;
  seller: Contact;
  buyer: Contact;
  property: Property;
  price?: number;
  isPreview?: boolean;
}

export const generateContractHtml = ({ type, seller, buyer, property, price, isPreview = false }: ContractData): string => {
  if (!seller || !buyer || !property) return "";

  const editableStyle = isPreview ? '' : 'contenteditable="true" style="border: 1px dashed #999; border-radius: 5px; padding: 5px;"';

  if (type === ContractType.buyOrSell) {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto;">
        <h1 style="text-align: center; font-size: 24px; font-weight: bold;">CONTRATO PROMESSA DE COMPRA E VENDA</h1>
        
        <h3>Entre os abaixo-assinados e adiante designados por:</h3>
        
        <h3>PRIMEIROS OUTORGANTES - PARTE VENDEDORA:</h3>
        <p><strong><span id="sellerName" ${editableStyle}>${seller.name}</span></strong>, portador do NIF <span id="sellerVat" ${editableStyle}>${seller.vat}</span>, estado civil <span id="sellerMaritalStatus" ${editableStyle}>${seller.maritalStatus}</span>, residente em <span id="sellerAddress" ${editableStyle}>${seller.address}</span>.</p>
        
        <h3>SEGUNDO OUTORGANTE - PARTE COMPRADORA:</h3>
        <p><strong><span id="buyerName" ${editableStyle}>${buyer.name}</span></strong>, portador do NIF <span id="buyerVat" ${editableStyle}>${buyer.vat}</span>, estado civil <span id="buyerMaritalStatus" ${editableStyle}>${buyer.maritalStatus}</span>, residente em <span id="buyerAddress" ${editableStyle}>${buyer.address}</span>.</p>
        
        <h3>Cláusula Primeira (Imóvel)</h3>
        <p><strong>Composição:</strong> Fração autónoma designada pela letra "<span id="propertyFraction" ${editableStyle}>${property.fraction}</span>", correspondente ao <span id="propertyFloor" ${editableStyle}>${property.floor}</span>º andar.</p>
        <p><strong>Destino:</strong> <span id="propertyDestination" ${editableStyle}>${property.destination}</span>.</p>
        
        <h3>Cláusula Segunda (Preço e Condições de Pagamento)</h3>
        <p><strong>Valor Total do Imóvel (€):</strong> ${isPreview ? 
          `<span>${new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(price || 0)}</span>` :
          `<input id="propertyPrice" type="number" value="${price || ''}" style="border: 1px solid #999; border-radius: 5px; padding: 5px; width: 100px;">`
        }</p>
        <p><strong>Forma de Pagamento:</strong> ${isPreview ? 
          `<span>-</span>` :
          `<input id="paymentMethod" type="text" value="" style="border: 1px solid #999; border-radius: 5px; padding: 5px; width: 200px;">`
        }</p>
        
        <h3>Local e Data:</h3>
        <p ${editableStyle} id="contractDate" title="Data do Contrato">${isPreview ? new Date().toLocaleDateString('pt-PT') : '_______________________________'}</p>
        
        <h3>Os Primeiros Outorgantes - Parte Vendedora:</h3>
        <p ${editableStyle} id="sellerSignature" title="Assinatura do Vendedor">${isPreview ? seller.name : '_______________________________'}</p>
        
        <h3>Os Segundos Outorgantes - Parte Compradora:</h3>
        <p ${editableStyle} id="buyerSignature" title="Assinatura do Comprador">${isPreview ? buyer.name : '_______________________________'}</p>
      </div>
    `;
  }

  // TODO: Implement rent contract template
  return "";
}; 