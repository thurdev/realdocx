import prisma from "~/lib/prisma";
import { TransactionType } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { amount } = await readBody(event);

  // Validar o valor
  if (!amount || amount <= 0) {
    return {
      error: "Invalid amount",
      status: 400,
    };
  }

  try {
    // Verificar se o usuário existe
    const user = await prisma.users.findUnique({
      where: {
        id: session.secure.userId
      }
    });

    if (!user) {
      return {
        error: "User not found",
        status: 404,
      };
    }

    // Criar a transação de crédito
    const transaction = await prisma.transactions.create({
      data: {
        amount,
        type: TransactionType.credit,
        subType: "manualCredit",
        userId: session.secure.userId,
      },
    });

    return {
      success: true,
      transaction,
    };
  } catch (error) {
    console.error("Error adding credits:", error);
    return {
      error: "Failed to add credits",
      status: 500,
    };
  }
}); 