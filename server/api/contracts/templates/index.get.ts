import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const templates = await prisma.contractTemplate.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        html: true,
        price: true,
        steps: {
          orderBy: {
            step: 'asc'
          },
          select: {
            step: true,
            title: true,
            description: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    });

    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return {
      error: "Failed to fetch templates",
    };
  }
}); 