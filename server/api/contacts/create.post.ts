import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const {
    name,
    vat,
    maritalStatus,
    marriedUnderRegime,
    identityType,
    identityNumber,
    identityExpirationDate,
    identityIssuer,
    country,
    address,
    neighborhood,
    state,
    city,
    zipCode,
    companyRegistration,
    companyCode,
    companyRCBECode,
    companySocialCapital,
    contactType,
  } = await readBody(event);

  if (!session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // TODO: Fix variables names on frontend and api, should match schema names

  // Create the contact
  await prisma.contacts.create({
    data: {
      // Contact Info
      name,
      vat,
      // Marital
      maritalStatus,
      marriedUnderRegime,
      // Identity Card
      identityType,
      identityNumber,
      identityExpirationDate: new Date(identityExpirationDate),
      identityIssuer,
      // Address (Company?)
      country,
      address,
      neighborhood,
      state,
      city,
      zipCode,
      // Company
      companyRegistration,
      companyCode,
      companyRCBECode,
      companySocialCapital,
      // Contact Type
      contactType,
      // Owner
      userId: session.secure.userId,
    },
  });

  return {
    success: true,
  };
});
