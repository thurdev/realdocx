import { defineEventHandler, getQuery } from 'h3'
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Get date range from query
  const query = getQuery(event);
  const startDate = query.startDate ? new Date(query.startDate as string) : new Date(new Date().setDate(1));
  const endDate = query.endDate ? new Date(query.endDate as string) : new Date();

  // Buscar total de contatos
  const total = await prisma.contacts.count({
    where: {
      userId: session.secure.userId,
    }
  });

  // Buscar novos contatos no período
  const newContacts = await prisma.contacts.count({
    where: {
      userId: session.secure.userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  return {
    total,
    new: newContacts
  }
}); 