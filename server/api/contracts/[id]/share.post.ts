import { randomBytes } from 'crypto';
import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Verifica se o usuário está autenticado
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const contractId = parseInt(event.context.params?.id || '');
  if (isNaN(contractId)) {
    return {
      error: "Invalid contract ID",
    };
  }

  // Verifica se o contrato existe e pertence ao usuário
  const contract = await prisma.contracts.findFirst({
    where: {
      id: contractId,
      generatedBy: session.secure.userId,
    },
  });

  if (!contract) {
    return {
      error: "Contract not found",
    };
  }

  // Gera um novo token de compartilhamento
  const shareToken = randomBytes(32).toString('hex');

  // Atualiza o contrato com o novo token
  await prisma.contracts.update({
    where: {
      id: contractId,
    },
    data: {
      shareToken,
    },
  });

  // Retorna o token e a URL de compartilhamento
  const shareUrl = `${getRequestURL(event).origin}/contracts/${contractId}?token=${shareToken}`;
  return {
    shareToken,
    shareUrl,
  };
}); 