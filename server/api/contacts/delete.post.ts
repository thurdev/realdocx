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

  // Delete the contact
  await prisma.contacts.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
});
