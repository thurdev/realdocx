import prisma from "~/lib/prisma";
import { createDebitTransaction } from "~/server/config/prices";
import { TransactionSubType } from "~/server/utils/types";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { templateId } = await readBody(event);

  // Buscar o template
  const template = await prisma.contractTemplate.findFirst({
    where: {
      id: templateId,
    },
  });

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
  const minutaPrice = 5.0; // Preço fixo da minuta

  if (balance < minutaPrice) {
    return {
      error: "Insufficient balance",
      requiredAmount: minutaPrice,
      currentBalance: balance,
    };
  }

  // Criar transação de débito
  await createDebitTransaction(prisma, {
    userId: session.secure.userId,
    subType: TransactionSubType.contractDownload,
    customAmount: minutaPrice,
  });

  // Retornar o template HTML
  return {
    success: true,
    html: template.html,
    currentBalance: balance - minutaPrice,
  };
});
