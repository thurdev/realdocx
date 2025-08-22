interface EmailPersonalization {
  to: {
    email: string;
    name: string;
  }[];
  subject: string;
}

interface EmailContent {
  type: string;
  value: string;
}

interface EmailData {
  personalizations: EmailPersonalization[];
  from: {
    email: string;
    name: string;
  };
  content: EmailContent[];
}

const WEBHOOK_URL = 'https://n8n.maismls.app/webhook/realdocx-sendmail';

// Email templates with RealDocx branding
const getEmailTemplate = (type: string, data: any, language: string = 'pt') => {
  const baseTemplate = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
        <div style="color: white; font-size: 32px; font-weight: bold; margin-bottom: 10px;">
          <span style="margin-right: 10px;">🏢</span>
          Real<span style="color: #60a5fa;">DOCX</span>
        </div>
        <p style="color: #bfdbfe; margin: 0; font-size: 16px;">Gestão Documental Profissional</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 40px 30px;">
        ${getContentByType(type, data, language)}
      </div>
      
      <!-- Footer -->
      <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0 0 10px; color: #64748b; font-size: 14px;">
          © ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 12px;">
          Este email foi enviado automaticamente pelo sistema RealDOCX.
        </p>
      </div>
    </div>
  `;
  
  return baseTemplate;
};

const getContentByType = (type: string, data: any, language: string) => {
  const translations = {
    pt: {
      welcome: {
        title: '🎉 Bem-vindo ao RealDOCX!',
        greeting: 'Olá {name}!',
        message: 'A sua conta foi criada com sucesso. Agora pode começar a criar contratos profissionais de forma simples e eficiente.',
        cta: 'Começar a Usar',
        features: [
          '📝 Criação de contratos profissionais',
          '👥 Gestão de contactos',
          '🏠 Gestão de propriedades',
          '💳 Sistema de pagamentos integrado'
        ]
      },
      contract: {
        title: '📄 Contrato Criado com Sucesso!',
        greeting: 'Olá {name}!',
        message: 'O seu contrato foi criado e está pronto para ser utilizado.',
        details: 'Detalhes do contrato:',
        amount: 'Valor debitado: €{amount}',
        cta: 'Ver Contrato'
      },
      topup: {
        title: '💰 Saldo Adicionado com Sucesso!',
        greeting: 'Olá {name}!',
        message: 'O seu saldo foi recarregado com sucesso.',
        amount: 'Valor adicionado: €{amount}',
        balance: 'Saldo atual: €{balance}',
        cta: 'Ver Carteira'
      },
      card: {
        title: '💳 Cartão Adicionado com Sucesso!',
        greeting: 'Olá {name}!',
        message: 'O seu novo método de pagamento foi adicionado à sua conta.',
        security: 'Os seus dados estão seguros e protegidos.',
        cta: 'Gerir Cartões'
      }
    },
    en: {
      welcome: {
        title: '🎉 Welcome to RealDOCX!',
        greeting: 'Hello {name}!',
        message: 'Your account has been successfully created. You can now start creating professional contracts simply and efficiently.',
        cta: 'Get Started',
        features: [
          '📝 Professional contract creation',
          '👥 Contact management',
          '🏠 Property management',
          '💳 Integrated payment system'
        ]
      },
      contract: {
        title: '📄 Contract Created Successfully!',
        greeting: 'Hello {name}!',
        message: 'Your contract has been created and is ready to be used.',
        details: 'Contract details:',
        amount: 'Amount debited: €{amount}',
        cta: 'View Contract'
      },
      topup: {
        title: '💰 Balance Added Successfully!',
        greeting: 'Hello {name}!',
        message: 'Your balance has been successfully topped up.',
        amount: 'Amount added: €{amount}',
        balance: 'Current balance: €{balance}',
        cta: 'View Wallet'
      },
      card: {
        title: '💳 Card Added Successfully!',
        greeting: 'Hello {name}!',
        message: 'Your new payment method has been added to your account.',
        security: 'Your data is safe and protected.',
        cta: 'Manage Cards'
      }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.pt;
  
  switch (type) {
    case 'welcome':
      return `
        <h1 style="color: #1e293b; font-size: 28px; margin-bottom: 20px; text-align: center;">
          ${t.welcome.title}
        </h1>
        <p style="color: #475569; font-size: 18px; margin-bottom: 30px; text-align: center;">
          ${t.welcome.greeting.replace('{name}', data.name)}
        </p>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          ${t.welcome.message}
        </p>
        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #334155; margin-bottom: 15px; font-size: 18px;">O que pode fazer:</h3>
          ${t.welcome.features.map(feature => `
            <p style="color: #64748b; margin: 8px 0; font-size: 14px;">
              ${feature}
            </p>
          `).join('')}
        </div>
        <div style="text-align: center;">
          <a href="https://realdocx.vercel.app/dashboard" 
             style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ${t.welcome.cta}
          </a>
        </div>
      `;
      
    case 'contract':
      return `
        <h1 style="color: #1e293b; font-size: 28px; margin-bottom: 20px; text-align: center;">
          ${t.contract.title}
        </h1>
        <p style="color: #475569; font-size: 18px; margin-bottom: 30px; text-align: center;">
          ${t.contract.greeting.replace('{name}', data.name)}
        </p>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          ${t.contract.message}
        </p>
        <div style="background-color: #f1f5f9; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #334155; margin-bottom: 15px; font-size: 18px;">${t.contract.details}</h3>
          <p style="color: #64748b; margin: 8px 0; font-size: 14px;">
            <strong>Tipo:</strong> ${data.contractType}
          </p>
          ${data.amount ? `
            <p style="color: #ef4444; margin: 8px 0; font-size: 14px; font-weight: bold;">
              ${t.contract.amount.replace('{amount}', data.amount)}
            </p>
          ` : ''}
        </div>
        <div style="text-align: center;">
          <a href="https://realdocx.vercel.app/contracts" 
             style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ${t.contract.cta}
          </a>
        </div>
      `;
      
    case 'topup':
      return `
        <h1 style="color: #1e293b; font-size: 28px; margin-bottom: 20px; text-align: center;">
          ${t.topup.title}
        </h1>
        <p style="color: #475569; font-size: 18px; margin-bottom: 30px; text-align: center;">
          ${t.topup.greeting.replace('{name}', data.name)}
        </p>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          ${t.topup.message}
        </p>
        <div style="background-color: #f0fdf4; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #22c55e;">
          <p style="color: #16a34a; margin: 8px 0; font-size: 18px; font-weight: bold;">
            ${t.topup.amount.replace('{amount}', data.amount)}
          </p>
          ${data.balance ? `
            <p style="color: #15803d; margin: 8px 0; font-size: 16px;">
              ${t.topup.balance.replace('{balance}', data.balance)}
            </p>
          ` : ''}
        </div>
        <div style="text-align: center;">
          <a href="https://realdocx.vercel.app/wallet" 
             style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ${t.topup.cta}
          </a>
        </div>
      `;
      
    case 'card':
      return `
        <h1 style="color: #1e293b; font-size: 28px; margin-bottom: 20px; text-align: center;">
          ${t.card.title}
        </h1>
        <p style="color: #475569; font-size: 18px; margin-bottom: 30px; text-align: center;">
          ${t.card.greeting.replace('{name}', data.name)}
        </p>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          ${t.card.message}
        </p>
        <div style="background-color: #f0f9ff; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #0ea5e9;">
          <p style="color: #0284c7; margin: 8px 0; font-size: 14px;">
            🔒 ${t.card.security}
          </p>
        </div>
        <div style="text-align: center;">
          <a href="https://realdocx.vercel.app/wallet" 
             style="background: linear-gradient(135deg, #3b82f6, #1e40af); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            ${t.card.cta}
          </a>
        </div>
      `;
      
    default:
      return '<p>Conteúdo do email</p>';
  }
};

const getSubjectByType = (type: string, language: string = 'pt') => {
  const subjects = {
    pt: {
      welcome: 'Bem-vindo ao RealDOCX! 🎉',
      contract: 'Contrato criado com sucesso 📄',
      topup: 'Saldo adicionado à sua carteira 💰',
      card: 'Novo cartão adicionado 💳'
    },
    en: {
      welcome: 'Welcome to RealDOCX! 🎉',
      contract: 'Contract created successfully 📄',
      topup: 'Balance added to your wallet 💰',
      card: 'New card added 💳'
    }
  };
  
  return subjects[language as keyof typeof subjects]?.[type as keyof typeof subjects['pt']] || subjects.pt[type as keyof typeof subjects['pt']];
};

export const sendEmail = async (
  type: 'welcome' | 'contract' | 'topup' | 'card',
  recipientEmail: string,
  recipientName: string,
  data: any = {},
  language: string = 'pt'
) => {
  try {
    const emailData: EmailData = {
      personalizations: [{
        to: [{
          email: recipientEmail,
          name: recipientName
        }],
        subject: getSubjectByType(type, language)
      }],
      from: {
        email: "noreply@realdocx.com",
        name: "RealDOCX"
      },
      content: [{
        type: "text/html",
        value: getEmailTemplate(type, { name: recipientName, ...data }, language)
      }]
    };

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error(`Email sending failed: ${response.statusText}`);
    }

    console.log(`Email sent successfully to ${recipientEmail} for event: ${type}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}; 