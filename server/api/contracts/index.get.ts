import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const generatedBy = session.secure.userId;

  const contracts = await prisma.contracts.findMany({
    where: {
      generatedBy,
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

  return contracts;
});
