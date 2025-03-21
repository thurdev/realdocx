export const generateRentHtml = (selectedLandlord: any, selectedTenant: any, selectedProperty: any): string => {
  if (!selectedLandlord || !selectedTenant || !selectedProperty) return "";

  const editableStyle = 'border: 1px dashed #999; border-radius: 4px; padding: 2px 6px; min-width: 50px; display: inline-block;';
  const inputStyle = 'border: 1px solid #999; border-radius: 4px; padding: 4px 8px; width: 120px; margin: 0 4px;';
  const sectionStyle = 'margin-bottom: 2rem;';
  const inlineStyle = 'display: inline-block; margin-right: 1rem;';
  const clauseStyle = 'font-size: 1.5rem; font-weight: bold; margin: 2rem 0 1.5rem; color: #1a1a1a;';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: auto;">
      <h1 style="text-align: center; font-size: 2rem; font-weight: bold; margin-bottom: 3rem;">CONTRATO DE ARRENDAMENTO</h1>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">1. Partes</h2>
        <h3>Primeiro Outorgante - Senhorio:</h3>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Nome:</strong> <span id="landlordName" contenteditable="true" style="${editableStyle}">${selectedLandlord.name}</span></p>
          <p style="${inlineStyle}"><strong>NIF:</strong> <span id="landlordVat" contenteditable="true" style="${editableStyle}">${selectedLandlord.vat}</span></p>
          <p style="${inlineStyle}"><strong>Estado Civil:</strong> <span id="landlordMaritalStatus" contenteditable="true" style="${editableStyle}">${selectedLandlord.maritalStatus}</span></p>
          <p><strong>Residência:</strong> <span id="landlordAddress" contenteditable="true" style="${editableStyle}">${selectedLandlord.address}</span></p>
        </div>
        
        <h3>Segundo Outorgante - Arrendatário:</h3>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Nome:</strong> <span id="tenantName" contenteditable="true" style="${editableStyle}">${selectedTenant.name}</span></p>
          <p style="${inlineStyle}"><strong>NIF:</strong> <span id="tenantVat" contenteditable="true" style="${editableStyle}">${selectedTenant.vat}</span></p>
          <p style="${inlineStyle}"><strong>Estado Civil:</strong> <span id="tenantMaritalStatus" contenteditable="true" style="${editableStyle}">${selectedTenant.maritalStatus}</span></p>
          <p><strong>Residência:</strong> <span id="tenantAddress" contenteditable="true" style="${editableStyle}">${selectedTenant.address}</span></p>
        </div>
      </div>

      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">2. Objeto do Contrato</h2>
        <p>O Senhorio dá de arrendamento ao Arrendatário, que aceita, o seguinte imóvel:</p>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Fração:</strong> <span id="propertyFraction" contenteditable="true" style="${editableStyle}">${selectedProperty.fraction}</span></p>
          <p style="${inlineStyle}"><strong>Andar:</strong> <span id="propertyFloor" contenteditable="true" style="${editableStyle}">${selectedProperty.floor}</span></p>
          <p style="${inlineStyle}"><strong>Destino:</strong> <span id="propertyDestination" contenteditable="true" style="${editableStyle}">${selectedProperty.destination}</span></p>
          <p><strong>Endereço:</strong> <span id="propertyAddress" contenteditable="true" style="${editableStyle}">${selectedProperty.address}</span></p>
        </div>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">3. Prazo e Renda</h2>
        <div style="${sectionStyle}">
          <p style="${inlineStyle}"><strong>Prazo do Contrato (meses):</strong> <input id="contractDuration" type="number" style="${inputStyle}"></p>
          <p style="${inlineStyle}"><strong>Valor da Renda Mensal (€):</strong> <input id="monthlyRent" type="number" style="${inputStyle}"></p>
          <p style="${inlineStyle}"><strong>Caução (€):</strong> <input id="deposit" type="number" style="${inputStyle}"></p>
          <p><strong>Forma de Pagamento:</strong> <input id="paymentMethod" type="text" style="${inputStyle} width: 300px;"></p>
        </div>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">4. Início do Contrato</h2>
        <p>O presente contrato tem início em <span id="contractStartDate" contenteditable="true" style="${editableStyle}">[Data de Início]</span>.</p>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">5. Obrigações do Arrendatário</h2>
        <p>O Arrendatário obriga-se a:</p>
        <ul>
          <li>Pagar a renda até o dia <input id="rentDueDay" type="number" min="1" max="31" style="${inputStyle}"> de cada mês</li>
          <li>Conservar o imóvel em bom estado</li>
          <li>Não realizar obras sem autorização do Senhorio</li>
          <li>Permitir vistorias ao imóvel com aviso prévio</li>
        </ul>
      </div>
      
      <div style="${sectionStyle}">
        <h2 style="${clauseStyle}">6. Encargos e Despesas</h2>
        <p>São da responsabilidade do Arrendatário as despesas correntes:</p>
        <ul>
          <li>Água</li>
          <li>Luz</li>
          <li>Gás</li>
          <li>Internet</li>
          <li>Condomínio (quando aplicável)</li>
        </ul>
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
            <p><strong>Senhorio:</strong></p>
            <span id="landlordSignature">__________________________</span>
          </div>
          <div>
            <p><strong>Arrendatário:</strong></p>
            <span id="tenantSignature">__________________________</span>
          </div>
        </div>
      </div>
    </div>
  `;
}; 