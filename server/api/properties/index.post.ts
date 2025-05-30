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
    id,
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
    numberOfDescriptionRegistry,
    neighborhoodDescriptionRegistry,
    conservatoryOfDescriptionRegistry,
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
    side,
    propertyType,
    matrixRegistration,
    neighborhoodMatrixRegistration,
  } = await readBody(event);

  if (!session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  const extra: Record<string, any> = {};

  // Because every field is optional, we need to check if the field is present
  if (country) {
    extra.country = country;
  }

  if (district) {
    extra.district = district;
  }

  if (city) {
    extra.city = city;
  }

  if (neighborhood) {
    extra.neighborhood = neighborhood;
  }

  if (neighborhood) {
    extra.neighborhood = neighborhood;
  }

  if (address) {
    extra.address = address;
  }

  if (number) {
    extra.number = number;
  }

  if (postalCode) {
    extra.postalCode = postalCode;
  }

  if (fraction) {
    extra.fraction = fraction;
  }

  if (floor) {
    extra.floor = floor;
  }

  if (destination) {
    extra.destination = destination;
  }

  if (numberOfDescriptionRegistry) {
    extra.numberOfDescriptionRegistry = numberOfDescriptionRegistry;
  }

  if (neighborhoodDescriptionRegistry) {
    extra.neighborhoodDescriptionRegistry = neighborhoodDescriptionRegistry;
  }

  if (conservatoryOfDescriptionRegistry) {
    extra.conservatoryOfDescriptionRegistry = conservatoryOfDescriptionRegistry;
  }

  if (matrixRegistration) {
    extra.matrixRegistration = matrixRegistration;
  }

  if (neighborhoodMatrixRegistration) {
    extra.neighborhoodMatrixRegistration = neighborhoodMatrixRegistration;
  }

  if (luNumber) {
    extra.luNumber = luNumber;
  }

  if (luDate) {
    extra.luDate = new Date(luDate);
  }

  if (luIssuer) {
    extra.luIssuer = luIssuer;
  }

  if (ecLetter) {
    extra.ecLetter = ecLetter;
  }

  if (ecNumber) {
    extra.ecNumber = ecNumber;
  }

  if (ecValidUntil) {
    extra.ecValidUntil = new Date(ecValidUntil);
  }

  if (chargesType) {
    extra.chargesType = chargesType;
  }

  if (chargesBank) {
    extra.chargesBank = chargesBank;
  }

  if (chargesAP) {
    extra.chargesAP = chargesAP;
  }

  if (chargesDate) {
    extra.chargesDate = new Date(chargesDate);
  }

  if (side) {
    extra.side = side;
  }

  if (propertyType) {
    extra.propertyType = propertyType;
  }

  if (id) {
    // Update the property
    await prisma.properties.update({
      where: {
        id: id,
      },
      data: extra,
    });
  } else {
    // Create the property
    await prisma.properties.create({
      data: {
        ...extra,
        // Owner
        userId: session.secure.userId,
      },
    });
  }

  return {
    success: true,
  };
});
