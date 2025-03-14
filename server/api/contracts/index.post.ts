import prisma from "~/lib/prisma";

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

  const { selectedBuyer, selectedSeller, selectedProperty, contractType, htmlContent } =
    await readBody(event);

  const generatedBy = session.secure.userId;

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

  return {
    success: true,
  };
});
