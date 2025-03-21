export const generateCPCVHtml = (selectedSeller: any, selectedBuyer: any, selectedProperty: any): string => {
  if (!selectedSeller || !selectedBuyer || !selectedProperty) return "";

  const editableStyle = 'border: 1px dashed #999; border-radius: 4px; padding: 2px 6px; min-width: 50px; display: inline-block;';
  const inputStyle = 'border: 1px solid #999; border-radius: 4px; padding: 4px 8px; width: 120px; margin: 0 4px;';
  const sectionStyle = 'margin-bottom: 2rem;';
  const inlineStyle = 'display: inline-block; margin-right: 1rem;';
  const clauseStyle = 'font-size: 1.5rem; font-weight: bold; margin: 2rem 0 1.5rem; color: #1a1a1a;';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto;">
      <h1 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 3rem;">CONTRATO PROMESSA DE COMPRA E VENDA</h1>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">1. Partes</h2>
        <h3>Primeiros Outorgantes - Parte Vendedora:</h3>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Nome:</strong> <span id="sellerName" contenteditable="true" style="${editableStyle}">${selectedSeller.name}</span></p>
          <p style="${inlineStyle}"><strong>NIF:</strong> <span id="sellerVat" contenteditable="true" style="${editableStyle}">${selectedSeller.vat}</span></p>
          <p style="${inlineStyle}"><strong>Estado Civil:</strong> <span id="sellerMaritalStatus" contenteditable="true" style="${editableStyle}">${selectedSeller.maritalStatus}</span></p>
          <p><strong>Residência:</strong> <span id="sellerAddress" contenteditable="true" style="${editableStyle}">${selectedSeller.address}</span></p>
        </div>
        
        <h3>Segundos Outorgantes - Parte Compradora:</h3>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Nome:</strong> <span id="buyerName" contenteditable="true" style="${editableStyle}">${selectedBuyer.name}</span></p>
          <p style="${inlineStyle}"><strong>NIF:</strong> <span id="buyerVat" contenteditable="true" style="${editableStyle}">${selectedBuyer.vat}</span></p>
          <p style="${inlineStyle}"><strong>Estado Civil:</strong> <span id="buyerMaritalStatus" contenteditable="true" style="${editableStyle}">${selectedBuyer.maritalStatus}</span></p>
          <p><strong>Residência:</strong> <span id="buyerAddress" contenteditable="true" style="${editableStyle}">${selectedBuyer.address}</span></p>
        </div>
      </div>

      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">2. Objeto do Contrato</h2>
        <p>A Parte Vendedora promete vender e a Parte Compradora promete comprar o seguinte imóvel:</p>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Fração:</strong> <span id="propertyFraction" contenteditable="true" style="${editableStyle}">${selectedProperty.fraction}</span></p>
          <p style="${inlineStyle}"><strong>Andar:</strong> <span id="propertyFloor" contenteditable="true" style="${editableStyle}">${selectedProperty.floor}</span></p>
          <p style="${inlineStyle}"><strong>Destino:</strong> <span id="propertyDestination" contenteditable="true" style="${editableStyle}">${selectedProperty.destination}</span></p>
          <p><strong>Endereço:</strong> <span id="propertyAddress" contenteditable="true" style="${editableStyle}">${selectedProperty.address}</span></p>
        </div>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">3. Preço e Condições de Pagamento</h2>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Valor Total do Imóvel (€):</strong> <input id="propertyPrice" type="number" style="${inputStyle}"></p>
          <p style="${inlineStyle}"><strong>Sinal (€):</strong> <input id="propertyDeposit" type="number" style="${inputStyle}"></p>
          <p><strong>Forma de Pagamento:</strong> <input id="paymentMethod" type="text" style="${inputStyle} width: 300px;"></p>
        </div>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">4. Escritura e Prazo</h2>
        <p>A escritura pública será celebrada até o dia <span id="contractDate" contenteditable="true" style="${editableStyle}">[Data da Escritura]</span>.</p>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">5. Encargos e Obrigações</h2>
        <p>O imóvel será entregue livre de quaisquer ónus, hipotecas ou encargos.</p>
        <p>Todas as despesas relacionadas à escritura serão pagas pela Parte Compradora.</p>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">6. Penalizações por Incumprimento</h2>
        <p>Se a Parte Compradora não cumprir o contrato, perderá o valor pago como sinal.</p>
        <p>Se a Parte Vendedora não cumprir o contrato, deverá devolver o sinal em dobro.</p>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">7. Lei Aplicável e Foro</h2>
        <p>O presente contrato rege-se pelas leis portuguesas e, em caso de litígio, as partes elegem o foro do local do imóvel.</p>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">Local e Data</h2>
        <p><span id="contractDate" contenteditable="true" style="${editableStyle}">[Data]</span></p>
        
        <h2 style="${clauseStyle}">Assinaturas</h2>
        <div style="margin-top: 3rem;">
          <div style="margin-bottom: 4rem;">
            <p><strong>Vendedor(es):</strong></p>
            <span id="sellerSignature">__________________________</span>
          </div>
          <div>
            <p><strong>Comprador(es):</strong></p>
            <span id="buyerSignature" >__________________________</span>
          </div>
        </div>
      </div>
    </div>
  `;
}; 