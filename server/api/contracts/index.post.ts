import prisma from "~/lib/prisma";
import { PRICES, createDebitTransaction } from "~/server/config/prices";
import { TransactionSubType } from "~/server/utils/types";

enum ContractType {
  BUY_OR_SELL = "buyOrSell",
  RENT = "rent",
}

enum ContactType {
  BUYER = "buyer",
  SELLER = "seller",
  RENTER = "renter",
  LANDLORD = "landlord",
}

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Verificar saldo do usuário
  const credits = await prisma.transactions.aggregate({
    where: {
      userId: session.secure.userId,
      type: "credit",
    },
    _sum: {
      amount: true,
    },
  });

  const debits = await prisma.transactions.aggregate({
    where: {
      userId: session.secure.userId,
      type: "debit",
    },
    _sum: {
      amount: true,
    },
  });

  const balance = (credits._sum.amount || 0) - (debits._sum.amount || 0);

  if (balance < PRICES.CONTRACT_CREATION) {
    return {
      error: "Insufficient balance",
      requiredAmount: PRICES.CONTRACT_CREATION,
      currentBalance: balance,
    };
  }

  const { selectedBuyer, selectedSeller, selectedProperty, contractType, htmlContent } =
    await readBody(event);

  const generatedBy = session.secure.userId;

  try {
    const createdContract = await prisma.contracts.create({
      data: {
        price: selectedProperty.price ?? 0,
        contractType: ContractType.BUY_OR_SELL,
        propertyId: selectedProperty.id,
        generatedBy,
        htmlContent,
      },
    });

    const contractBuyer = await prisma.contractContacts.create({
      data: {
        contractId: createdContract.id,
        contactId: selectedBuyer.id,
        contactType: ContactType.BUYER,
      },
    });

    const contractSeller = await prisma.contractContacts.create({
      data: {
        contractId: createdContract.id,
        contactId: selectedSeller.id,
        contactType: ContactType.SELLER,
      },
    });

    await prisma.contracts.update({
      where: {
        id: createdContract.id,
      },
      data: {
        contacts: {
          connect: [
            {
              id: contractBuyer.id,
            },
            {
              id: contractSeller.id,
            },
          ],
        },
      },
    });

    // Criar transação de débito
    await createDebitTransaction(prisma, {
      userId: session.secure.userId,
      contractId: createdContract.id,
      subType: TransactionSubType.contractCreation,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error creating contract:", error);
    return {
      error: "Failed to create contract",
      status: 500,
    };
  }
});
