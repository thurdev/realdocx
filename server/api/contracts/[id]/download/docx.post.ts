import prisma from "~/lib/prisma";
import HTMLtoDOCX from 'html-to-docx';

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const id = Number(event.context.params?.id);

  if (!id) {
    return {
      error: "Invalid contract ID",
    };
  }

  // Buscar o contrato
  const contract = await prisma.contracts.findFirst({
    where: {
      id,
      generatedBy: session.secure.userId,
    },
  });

  if (!contract) {
    return {
      error: "Contract not found or unauthorized",
    };
  }

  try {
    // Gerar DOCX
    const docx = await HTMLtoDOCX(contract.htmlContent || "", null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    });

    return {
      file: Buffer.from(docx).toString("base64"),
    };
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return {
      error: "Failed to generate DOCX",
    };
  }
}); 