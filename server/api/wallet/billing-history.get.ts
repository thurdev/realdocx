import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Get query parameters
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Buscar transações de crédito (compras)
  const billingHistory = await prisma.transactions.findMany({
    where: {
      userId: session.secure.userId,
      type: "credit",
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      contract: {
        include: {
          property: true,
        },
      },
    },
    skip,
    take: limit,
  });

  // Contar total de transações para paginação
  const total = await prisma.transactions.count({
    where: {
      userId: session.secure.userId,
      type: "credit",
    },
  });

  // Calcular total gasto
  const totalSpent = await prisma.transactions.aggregate({
    where: {
      userId: session.secure.userId,
      type: "credit",
    },
    _sum: {
      amount: true,
    },
  });

  return {
    billingHistory,
    totalSpent: totalSpent._sum.amount || 0,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      perPage: limit,
    },
  };
}); 