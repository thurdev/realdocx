import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id || '');
  const query = getQuery(event);
  const shareToken = query.token as string;

  if (isNaN(id)) {
    return {
      error: "Invalid contract ID",
    };
  }

  // Se tiver um token de compartilhamento, verifica se é válido
  if (shareToken) {
    const contract = await prisma.contracts.findFirst({
      where: {
        id,
        shareToken,
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

    if (contract) {
      return contract;
    }
  }

  // Se não tiver token ou o token for inválido, verifica se o usuário está autenticado
  const session = await getUserSession(event);
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Contract not found",
    };
  }

  // Busca o contrato do usuário
  const contract = await prisma.contracts.findFirst({
    where: {
      id,
      generatedBy: session.secure.userId,
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

  if (!contract) {
    return {
      error: "Contract not found",
    };
  }

  return contract;
}); 