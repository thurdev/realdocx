interface EmailPersonalization {
  to: {
    email: string;
    name: string;
  }[];
}

interface EmailContent {
  type: string;
  value: string;
}

interface EmailData {
  personalizations: EmailPersonalization[];
  subject: string;
  from: {
    email: string;
    name: string;
  };
  content: EmailContent[];
}

const WEBHOOK_URL = "https://n8n.maismls.app/webhook/realdocx-sendmail";

// Email templates with simple RealDocx branding
const getEmailTemplate = (type: string, data: any, language: string = "pt") => {
  const baseTemplate = `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RealDOCX</title>
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #3b82f6; margin-bottom: 30px;">
                <h1 style="margin: 0; color: #1e40af; font-size: 28px;">
                    🏢 Real<span style="color: #3b82f6;">DOCX</span>
                </h1>
                <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">
                    Gestão Documental Profissional
                </p>
            </div>
            
            <!-- Content -->
            <div style="color: #374151;">
                ${getContentByType(type, data, language)}
            </div>
            
            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
                <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.</p>
                <p style="margin: 0;">realdocx.com | suporte@realdocx.com</p>
                <p style="margin: 10px 0 0; font-size: 11px; color: #9ca3af;">
                    ${
                      language === "en"
                        ? "If you did not expect this email, please ignore it."
                        : "Se não esperava este email, pode ignorá-lo."
                    }
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  return baseTemplate;
};

const getContentByType = (type: string, data: any, language: string) => {
  const translations = {
    pt: {
      welcome: {
        title: "🎉 Bem-vindo ao RealDOCX!",
        greeting: "Olá {name}!",
        message:
          "A sua conta foi criada com sucesso. Agora pode começar a criar contratos profissionais de forma simples e eficiente.",
        cta: "Começar a Usar",
        features: [
          "📝 Criação de contratos profissionais",
          "👥 Gestão de contactos",
          "🏠 Gestão de propriedades",
          "💳 Sistema de pagamentos integrado",
        ],
      },
      contract: {
        title: "📄 Contrato Criado com Sucesso!",
        greeting: "Olá {name}!",
        message: "O seu contrato foi criado e está pronto para ser utilizado.",
        details: "Detalhes do contrato:",
        amount: "Valor debitado: €{amount}",
        cta: "Ver Contrato",
      },
      topup: {
        title: "💰 Saldo Adicionado com Sucesso!",
        greeting: "Olá {name}!",
        message: "O seu saldo foi recarregado com sucesso.",
        amount: "Valor adicionado: €{amount}",
        balance: "Saldo atual: €{balance}",
        cta: "Ver Carteira",
      },
      card: {
        title: "💳 Cartão Adicionado com Sucesso!",
        greeting: "Olá {name}!",
        message: "O seu novo método de pagamento foi adicionado à sua conta.",
        security: "Os seus dados estão seguros e protegidos.",
        cta: "Gerir Cartões",
      },
      cardRemoval: {
        title: "💳 Cartão Removido com Sucesso!",
        greeting: "Olá {name}!",
        message: "O seu método de pagamento foi removido com sucesso.",
        cta: "Gerir Cartões",
      },
    },
    en: {
      welcome: {
        title: "🎉 Welcome to RealDOCX!",
        greeting: "Hello {name}!",
        message:
          "Your account has been successfully created. You can now start creating professional contracts simply and efficiently.",
        cta: "Get Started",
        features: [
          "📝 Professional contract creation",
          "👥 Contact management",
          "🏠 Property management",
          "💳 Integrated payment system",
        ],
      },
      contract: {
        title: "📄 Contract Created Successfully!",
        greeting: "Hello {name}!",
        message: "Your contract has been created and is ready to be used.",
        details: "Contract details:",
        amount: "Amount debited: €{amount}",
        cta: "View Contract",
      },
      topup: {
        title: "💰 Balance Added Successfully!",
        greeting: "Hello {name}!",
        message: "Your balance has been successfully topped up.",
        amount: "Amount added: €{amount}",
        balance: "Current balance: €{balance}",
        cta: "View Wallet",
      },
      card: {
        title: "💳 Card Added Successfully!",
        greeting: "Hello {name}!",
        message: "Your new payment method has been added to your account.",
        security: "Your data is safe and protected.",
        cta: "Manage Cards",
      },
      cardRemoval: {
        title: "💳 Card Removed Successfully!",
        greeting: "Hello {name}!",
        message: "Your payment method has been removed successfully.",
        cta: "Manage Cards",
      },
    },
  };

  const t =
    translations[language as keyof typeof translations] || translations.pt;

  switch (type) {
    case "welcome":
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">${t.welcome.title}</h2>
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>${t.welcome.greeting.replace(
          "{name}",
          data.name
        )}</strong></p>
        <p style="margin-bottom: 20px;">${t.welcome.message}</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 15px;">O que pode fazer:</h3>
          ${t.welcome.features
            .map(
              (feature) =>
                `<p style="margin: 5px 0; color: #6b7280;">• ${feature}</p>`
            )
            .join("")}
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://realdocx.com/dashboard" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${t.welcome.cta}
          </a>
        </p>
        
        <p style="font-size: 14px; color: #6b7280; border-left: 3px solid #3b82f6; padding-left: 15px; margin: 20px 0;">
          <strong>Segurança:</strong> Os seus dados estão protegidos com encriptação de nível bancário.
        </p>
      `;

    case "contract":
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">${
          t.contract.title
        }</h2>
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>${t.contract.greeting.replace(
          "{name}",
          data.name
        )}</strong></p>
        <p style="margin-bottom: 20px;">${t.contract.message}</p>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 15px;">${
            t.contract.details
          }</h3>
          <p style="margin: 5px 0;"><strong>Tipo:</strong> ${
            data.contractType
          }</p>
          ${
            data.amount
              ? `<p style="margin: 5px 0; color: #dc2626;"><strong>${t.contract.amount.replace(
                  "{amount}",
                  data.amount
                )}</strong></p>`
              : ""
          }
          <p style="margin: 5px 0; color: #059669;"><strong>Status:</strong> Criado e pronto para utilização</p>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://realdocx.com/contracts" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${t.contract.cta}
          </a>
        </p>
      `;

    case "topup":
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">${t.topup.title}</h2>
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>${t.topup.greeting.replace(
          "{name}",
          data.name
        )}</strong></p>
        <p style="margin-bottom: 20px;">${t.topup.message}</p>
        
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <h3 style="color: #374151; margin-bottom: 15px;">Detalhes da Transação</h3>
          <p style="margin: 5px 0; color: #059669; font-size: 18px;"><strong>💰 ${t.topup.amount.replace(
            "{amount}",
            data.amount
          )}</strong></p>
          ${
            data.balance
              ? `<p style="margin: 5px 0; color: #059669;"><strong>${t.topup.balance.replace(
                  "{balance}",
                  data.balance
                )}</strong></p>`
              : ""
          }
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">Data: ${new Date().toLocaleDateString(
            "pt-PT"
          )} às ${new Date().toLocaleTimeString("pt-PT")}</p>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://realdocx.com/wallet" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${t.topup.cta}
          </a>
        </p>
      `;

    case "card":
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">${t.card.title}</h2>
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>${t.card.greeting.replace(
          "{name}",
          data.name
        )}</strong></p>
        <p style="margin-bottom: 20px;">${t.card.message}</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
          <p style="margin: 5px 0; color: #0284c7;"><strong>🔒 ${
            t.card.security
          }</strong></p>
          <p style="margin: 10px 0 5px; color: #6b7280; font-size: 14px;">• Cartões de crédito e débito (Visa, Mastercard)</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">• Processamento seguro via Stripe</p>
          <p style="margin: 5px 0; color: #6b7280; font-size: 14px;">• Transações instantâneas</p>
        </div>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://realdocx.com/wallet" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${t.card.cta}
          </a>
        </p>
      `;

    case "cardRemoval":
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">${
          t.cardRemoval.title
        }</h2>
        <p style="font-size: 16px; margin-bottom: 15px;"><strong>${t.cardRemoval.greeting.replace(
          "{name}",
          data.name
        )}</strong></p>
        <p style="margin-bottom: 20px;">${t.cardRemoval.message}</p>
        
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://realdocx.com/wallet" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ${t.cardRemoval.cta}
          </a>
        </p>
      `;

    default:
      return `
        <h2 style="color: #1e40af; margin-bottom: 20px;">Notificação RealDOCX</h2>
        <p>Recebeu uma notificação do sistema RealDOCX.</p>
      `;
  }
};

const getSubjectByType = (type: string, language: string = "pt") => {
  const subjects = {
    pt: {
      welcome: "Bem-vindo ao RealDOCX! 🎉",
      contract: "Contrato criado com sucesso 📄",
      topup: "Saldo adicionado à sua carteira 💰",
      card: "Novo cartão adicionado 💳",
      cardRemoval: "Cartão removido 💳",
    },
    en: {
      welcome: "Welcome to RealDOCX! 🎉",
      contract: "Contract created successfully 📄",
      topup: "Balance added to your wallet 💰",
      card: "New card added 💳",
      cardRemoval: "Card removed 💳",
    },
  };

  return (
    subjects[language as keyof typeof subjects]?.[
      type as keyof (typeof subjects)["pt"]
    ] || subjects.pt[type as keyof (typeof subjects)["pt"]]
  );
};

// Function to get simple text content for emails
const getSimpleTextContent = (
  type: string,
  data: any,
  language: string = "pt"
) => {
  const t = language === "en" ? "en" : "pt";

  switch (type) {
    case "welcome":
      return t === "en"
        ? `Welcome to RealDOCX!

Hello ${data.name}!

Your account has been successfully created. You can now start creating professional real estate contracts.

Get started: https://realdocx.com/dashboard

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Bem-vindo ao RealDOCX!

Olá ${data.name}!

A sua conta foi criada com sucesso. Agora pode começar a criar contratos imobiliários profissionais.

Começar: https://realdocx.com/dashboard

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;

    case "contract":
      return t === "en"
        ? `Contract Created Successfully!

Hello ${data.name}!

Your contract has been created and is ready to use.
Type: ${data.contractType}
${data.amount ? `Amount debited: €${data.amount}` : ""}

View contract: https://realdocx.com/contracts

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Contrato Criado com Sucesso!

Olá ${data.name}!

O seu contrato foi criado e está pronto para ser utilizado.
Tipo: ${data.contractType}
${data.amount ? `Valor debitado: €${data.amount}` : ""}

Ver contrato: https://realdocx.com/contracts

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;

    case "topup":
      return t === "en"
        ? `Balance Added Successfully!

Hello ${data.name}!

Your balance has been successfully topped up.
Amount added: €${data.amount || "0.00"}
${data.balance ? `Current balance: €${data.balance}` : ""}

View wallet: https://realdocx.com/wallet

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Saldo Adicionado com Sucesso!

Olá ${data.name}!

O seu saldo foi recarregado com sucesso.
Valor adicionado: €${data.amount || "0.00"}
${data.balance ? `Saldo atual: €${data.balance}` : ""}

Ver carteira: https://realdocx.com/wallet

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;

    case "card":
      return t === "en"
        ? `Card Added Successfully!

Hello ${data.name}!

Your new payment method has been added to your account.

Manage cards: https://realdocx.com/wallet

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Cartão Adicionado com Sucesso!

Olá ${data.name}!

O seu novo método de pagamento foi adicionado à sua conta.

Gerir cartões: https://realdocx.com/wallet

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;

    case "cardRemoval":
      return t === "en"
        ? `Card Removed Successfully!

Hello ${data.name}!

Your payment method has been removed successfully.

Manage cards: https://realdocx.com/wallet

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Cartão Removido com Sucesso!

Olá ${data.name}!

O seu método de pagamento foi removido com sucesso.

Gerir cartões: https://realdocx.com/wallet

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;

    default:
      return t === "en"
        ? `RealDOCX Notification

You have received a notification from the RealDOCX system.

---
RealDOCX - Professional Document Management
© ${new Date().getFullYear()} RealDOCX. All rights reserved.`
        : `Notificação RealDOCX

Recebeu uma notificação do sistema RealDOCX.

---
RealDOCX - Gestão Documental Profissional
© ${new Date().getFullYear()} RealDOCX. Todos os direitos reservados.`;
  }
};

export const sendEmail = async (
  type: "welcome" | "contract" | "topup" | "card" | "cardRemoval",
  recipientEmail: string,
  recipientName: string,
  data: any = {},
  language: string = "pt"
) => {
  try {
    console.log(
      `[EMAIL] Starting email send process for type: ${type}, recipient: ${recipientEmail}`
    );

    const subject = getSubjectByType(type, language);
    const htmlContent = getEmailTemplate(
      type,
      { name: recipientName, ...data },
      language
    );
    const textContent = getSimpleTextContent(
      type,
      { name: recipientName, ...data },
      language
    );

    const emailData: EmailData = {
      personalizations: [
        {
          to: [
            {
              email: recipientEmail,
              name: recipientName,
            },
          ],
        },
      ],
      subject: subject,
      from: {
        email: "noreply@realdocx.com",
        name: "RealDOCX",
      },
      content: [
        {
          type: "text/plain",
          value: textContent,
        },
        {
          type: "text/html",
          value: htmlContent,
        },
      ],
    };

    console.log(`[EMAIL] Webhook URL: ${WEBHOOK_URL}`);
    console.log(`[EMAIL] Email payload prepared:`, {
      to: emailData.personalizations[0].to[0].email,
      subject: emailData.subject,
      textLength: textContent.length,
      htmlLength: htmlContent.length,
    });

    console.log(`[EMAIL] Making fetch request to webhook...`);
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "RealDOCX-EmailService/1.0",
      },
      body: JSON.stringify(emailData),
    });

    console.log(
      `[EMAIL] Response status: ${response.status} ${response.statusText}`
    );
    console.log(
      `[EMAIL] Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    const responseText = await response.text();
    console.log(`[EMAIL] Response body:`, responseText);

    if (!response.ok) {
      throw new Error(
        `Email sending failed: ${response.status} ${response.statusText} - ${responseText}`
      );
    }

    console.log(
      `[EMAIL] Email sent successfully to ${recipientEmail} for event: ${type}`
    );
    return { success: true, response: responseText };
  } catch (error) {
    console.error("[EMAIL] Error sending email:", error);

    // Additional error details
    if (error instanceof Error) {
      console.error("[EMAIL] Error name:", error.name);
      console.error("[EMAIL] Error message:", error.message);
      console.error("[EMAIL] Error stack:", error.stack);
    }

    return { success: false, error };
  }
};
