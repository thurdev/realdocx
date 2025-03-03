import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const properties = await prisma.properties.findMany({
    where: {
      userId: session.secure.userId,
    },
  });

  return properties;
});
