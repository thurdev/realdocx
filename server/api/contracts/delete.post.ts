import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = await readBody(event);

  if (!id) {
    return {
      error: "Unauthorized",
    };
  }

  // Check if the contract belongs to the user
  const contract = await prisma.contracts.findFirst({
    where: {
      id,
      generatedBy: session.secure.userId,
    },
  });

  if (!contract) {
    return {
      error: "Contract not found",
    };
  }

  // delete contract contacts first
  await prisma.contractContacts.deleteMany({
    where: {
      contractId: id,
    },
  });

  // Delete the contract
  await prisma.contracts.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
}); 