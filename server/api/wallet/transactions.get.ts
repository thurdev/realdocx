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

  // Buscar transações com paginação
  const transactions = await prisma.transactions.findMany({
    where: {
      userId: session.secure.userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      contract: {
        include: {
          property: true,
          contacts: {
            include: {
              contacts: true,
            },
          },
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
    },
  });

  return {
    transactions,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      perPage: limit,
    },
  };
}); 