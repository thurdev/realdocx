import prisma from "~/lib/prisma";
import puppeteer from "puppeteer";

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
    // Gerar PDF usando Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(contract.htmlContent || "");
    const pdf = await page.pdf({ format: "A4" });
    await browser.close();

    return {
      file: Buffer.from(pdf).toString("base64"),
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      error: "Failed to generate PDF",
    };
  }
}); 