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
    country,
    district,
    city,
    neighborhood,
    address,
    number,
    postalCode,
    fraction,
    floor,
    destination,
    matrixRegistration,
    buildingDescriptionNumber,
    buildingDescriptionRegistry,
    luNumber,
    luDate, // Date
    luIssuer,
    ecLetter,
    ecNumber,
    ecValidUntil, // Date
    chargesType, // maybe its a type need to check the values
    chargesBank,
    chargesAP,
    chargesDate, // Date
  } = await readBody(event);

  if (!session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // TODO: Check variables, some might be required and some might be optional

  // Create the contact
  await prisma.properties.create({
    data: {
      // Address info,
      country,
      district,
      city,
      neighborhood,
      postalCode,
      address,
      number,
      // Property info,
      fraction,
      floor,
      destination,
      // Matrix info,
      matrixRegistration,
      buildingDescriptionNumber,
      buildingDescriptionRegistry,
      // Lu info,
      luNumber,
      luDate: new Date(luDate),
      luIssuer,
      // Ec info,
      ecLetter,
      ecNumber,
      ecValidUntil: new Date(ecValidUntil),
      chargesType,
      chargesBank,
      chargesAP,
      chargesDate: new Date(chargesDate),
      // Owner
      userId: session.secure.userId,
    },
  });

  return {
    success: true,
  };
});
