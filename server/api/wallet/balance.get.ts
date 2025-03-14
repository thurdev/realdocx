import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Calcular o saldo total (créditos - débitos)
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

  return {
    balance,
    totalCredits: credits._sum.amount || 0,
    totalDebits: debits._sum.amount || 0,
  };
}); 