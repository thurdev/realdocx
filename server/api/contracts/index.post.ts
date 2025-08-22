import prisma from "~/lib/prisma";
import { createDebitTransaction } from "~/server/config/prices";
import { TransactionSubType } from "~/server/utils/types";
import { ContractType } from "@prisma/client";
import templates from "./templates/data.json";
import { sendEmail } from "~/server/utils/email";
// TODO FIX CHANGE TO ANOTHER FILE THE TEMPLATES INSTEAD OF THE ENDPOINT OF GETTING TEMPLATES
// THEN UPDATE THE FRONTEND TO GET THE TEMPLATES FROM THE ENDPOINT OF GETTING TEMPLATES

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const {
    firstPartyIds,
    secondPartyIds,
    propertyId,
    contractType,
    htmlContent,
    templateId,
  } = await readBody(event);

  // Buscar o template do array do frontend
  const template = templates.find((t) => t.id === templateId);

  if (!template) {
    return {
      error: "Template not found",
    };
  }

  // Verificar saldo do usuário
  const credits = await prisma.transactions.aggregate({
    where: {
      userId: session.secure.userId,
      type: "credit",
    },
    _sum: {
      amount: true,
    },
  });

  const debits = await prisma.transactions.aggregate({
    where: {
      userId: session.secure.userId,
      type: "debit",
    },
    _sum: {
      amount: true,
    },
  });

  const balance = (credits._sum.amount || 0) - (debits._sum.amount || 0);

  if (balance < template.price) {
    return {
      error: "Insufficient balance",
      requiredAmount: template.price,
      currentBalance: balance,
    };
  }

  const cType = contractType === "CPCV" ? "SALE" : "RENT";

  try {
    // Get user info for email
    const user = await prisma.users.findUnique({
      where: { id: session.secure.userId },
    });

    // Criar o contrato
    const createdContract = await prisma.contracts.create({
      data: {
        price: 0,
        deposit: 0,
        paymentMethod: "cash",
        propertyId,
        generatedBy: session.secure.userId,
        htmlContent,
        templateId,
        contractType: cType,
        contacts: {
          create: [
            ...firstPartyIds.map((id: number) => ({
              contactId: id,
              contactType: "seller",
            })),
            ...secondPartyIds.map((id: number) => ({
              contactId: id,
              contactType: "buyer",
            })),
          ],
        },
      },
      include: {
        contacts: {
          include: {
            contacts: true,
          },
        },
        property: true,
      },
    });

    // Criar transação de débito com o preço do template
    await createDebitTransaction(prisma, {
      userId: session.secure.userId,
      contractId: createdContract.id,
      subType: TransactionSubType.contractCreation,
      customAmount: template.price,
    });

    // Send contract creation email
    if (user) {
      try {
        await sendEmail(
          "contract",
          user.email,
          user.name || user.email.split("@")[0],
          {
            contractType: cType,
            amount: template.price.toFixed(2),
          },
          "pt"
        );
      } catch (error) {
        console.error("Failed to send contract creation email:", error);
        // Don't fail contract creation if email fails
      }
    }

    return {
      success: true,
      contract: createdContract,
    };
  } catch (error) {
    console.error("Error creating contract:", error);
    return {
      error: "Failed to create contract",
    };
  }
});
