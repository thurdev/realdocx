import prisma from "~/lib/prisma";
import puppeteer from "puppeteer";
import templates from "./templates/data.json";
import { getWalletBalance, registerDebit } from "~/server/utils/wallet";
import { TransactionSubType } from "~/server/utils/types";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const id = getQuery(event).id;

  if (!id) {
    return Error("Invalid template ID");
  }

  // Buscar o template
  const template = templates.find((t) => t.id === Number(id));

  if (!template) {
    return Error("Template not found or unauthorized");
  }

  const { balance } = await getWalletBalance(session.secure.userId);

  if (balance < template.downloadPrice) {
    return Error("Insufficient balance");
  }

  await registerDebit(
    session.secure.userId,
    template.downloadPrice,
    TransactionSubType.contractDownload
  );

  try {
    // Gerar Docx usando Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(template.html || "");
    const docx = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return {
      file: Buffer.from(docx).toString("base64"),
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return Error("Failed to generate PDF");
  }
});
