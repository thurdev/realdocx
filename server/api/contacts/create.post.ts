import prisma from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return Error("User not authenticated");
  }

  const {
    id,
    name,
    gender,
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
    marriedContactId,
  } = await readBody(event);

  if (!session.secure.userId) {
    return Error("User not found");
  }

  // The only required input is the name the user can edit the contact later
  if (!name) {
    return Error("Name is required");
  }

  const extra: Record<string, unknown> = {};

  if (gender) {
    extra.gender = gender;
  }

  if (vat) {
    extra.vat = vat;
  }

  if (identityExpirationDate) {
    extra.identityExpirationDate = new Date(identityExpirationDate);
  }

  if (maritalStatus) {
    extra.maritalStatus = maritalStatus;
  }

  if (marriedUnderRegime) {
    extra.marriedUnderRegime = marriedUnderRegime;
  }

  if (marriedContactId) {
    extra.marriedContactId = Number(marriedContactId);
  }

  if (identityType) {
    extra.identityType = identityType;
  }

  if (identityNumber) {
    extra.identityNumber = identityNumber;
  }

  if (identityIssuer) {
    extra.identityIssuer = identityIssuer;
  }

  if (country) {
    extra.country = country;
  }

  if (address) {
    extra.address = address;
  }

  if (neighborhood) {
    extra.neighborhood = neighborhood;
  }

  if (state) {
    extra.state = state;
  }

  if (city) {
    extra.city = city;
  }

  if (zipCode) {
    extra.zipCode = zipCode;
  }

  if (companyRegistration) {
    extra.companyRegistration = companyRegistration;
  }

  if (companyCode) {
    extra.companyCode = companyCode;
  }

  if (companyRCBECode) {
    extra.companyRCBECode = companyRCBECode;
  }

  if (companySocialCapital) {
    extra.companySocialCapital = companySocialCapital;
  }

  let contact;

  if (id) {
    // Update the contact
    contact = await prisma.contacts.update({
      where: {
        id,
      },
      data: {
        // Contact Info
        name,
        vat,
        // Contact Type
        contactType,
        // Owner
        userId: session.secure.userId,
        ...extra,
      },
    });
  } else {
    // Create the contact
    contact = await prisma.contacts.create({
      data: {
        // Contact Info
        name,
        // Contact Type
        contactType,
        // Owner
        userId: session.secure.userId,
        ...extra,
      },
    });
  }

  if (marriedContactId) {
    // we should now update the married contact with the id of the new contact
    await prisma.contacts.update({
      where: {
        id: Number(marriedContactId),
      },
      data: {
        marriedContactId: contact.id,
        maritalStatus: maritalStatus,
        marriedUnderRegime: marriedUnderRegime,
      },
    });
  }

  return Response.json({
    message: "Contact created successfully",
    success: true,
  });
});
