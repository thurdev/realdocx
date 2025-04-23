import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  // Lê o conteúdo do arquivo JSON
  const jsonContent = fs.readFileSync(
    path.join(__dirname, "seed.json"),
    "utf-8"
  );
  const { templates } = JSON.parse(jsonContent);

  // Insere os templates
  for (const template of templates) {
    const createdTemplate = await prisma.contractTemplate.upsert({
      where: { id: template.id },
      update: {
        price: template.type === "SALE" ? 49.99 : 29.99,
      },
      create: {
        ...template,
        price: template.type === "SALE" ? 49.99 : 29.99,
        steps: {
          create:
            template.type === "RENT"
              ? [
                  {
                    step: 1,
                    title: { pt: "Selecionar Tipo", en: "Select Type" },
                    description: {
                      pt: "Escolha o tipo de contrato",
                      en: "Choose contract type",
                    },
                  },
                  {
                    step: 2,
                    title: { pt: "Partes", en: "Parties" },
                    description: {
                      pt: "Preencha os dados do senhorio e inquilino",
                      en: "Fill landlord and tenant data",
                    },
                  },
                  {
                    step: 3,
                    title: { pt: "Imóvel", en: "Property" },
                    description: {
                      pt: "Selecione o imóvel",
                      en: "Select the property",
                    },
                  },
                  {
                    step: 4,
                    title: { pt: "Clausulas", en: "Clauses" },
                    description: {
                      pt: "Selecione as cláusulas",
                      en: "Select clauses",
                    },
                  },
                  {
                    step: 5,
                    title: { pt: "Detalhes", en: "Details" },
                    description: {
                      pt: "Preencha os detalhes do contrato",
                      en: "Fill contract details",
                    },
                  },
                ]
              : [
                  {
                    step: 1,
                    title: { pt: "Selecionar Tipo", en: "Select Type" },
                    description: {
                      pt: "Escolha o tipo de contrato",
                      en: "Choose contract type",
                    },
                  },
                  {
                    step: 2,
                    title: { pt: "Partes", en: "Parties" },
                    description: {
                      pt: "Preencha os dados do vendedor e comprador",
                      en: "Fill seller and buyer data",
                    },
                  },
                  {
                    step: 3,
                    title: { pt: "Imóvel", en: "Property" },
                    description: {
                      pt: "Selecione o imóvel",
                      en: "Select the property",
                    },
                  },

                  {
                    step: 4,
                    title: { pt: "Clausulas", en: "Clauses" },
                    description: {
                      pt: "Selecione as cláusulas",
                      en: "Select clauses",
                    },
                  },
                  {
                    step: 5,
                    title: { pt: "Detalhes", en: "Details" },
                    description: {
                      pt: "Preencha os detalhes do contrato",
                      en: "Fill contract details",
                    },
                  },
                ],
        },
      },
    });

    console.log(`Created/Updated template: ${createdTemplate.name}`);
  }

  // Criar contatos de exemplo
  const contact1 = await prisma.contacts.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "João Silva",
      vat: "123456789",
      maritalStatus: "single",
      identityType: "citizenCard",
      identityNumber: "12345678",
      identityExpirationDate: new Date("2025-12-31"),
      identityIssuer: "República Portuguesa",
      country: "Portugal",
      address: "Rua Principal, 123",
      neighborhood: "Centro",
      state: "Lisboa",
      city: "Lisboa",
      zipCode: "1000-000",
      contactType: "individual",
      companyRegistration: "",
      companyCode: "",
      companyRCBECode: "",
      companySocialCapital: "",
      userId: 1, // Assumindo que existe um usuário com ID 1
    },
  });

  const contact2 = await prisma.contacts.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Maria Santos",
      vat: "987654321",
      maritalStatus: "married",
      identityType: "citizenCard",
      identityNumber: "87654321",
      identityExpirationDate: new Date("2025-12-31"),
      identityIssuer: "República Portuguesa",
      country: "Portugal",
      address: "Avenida Central, 456",
      neighborhood: "Baixa",
      state: "Lisboa",
      city: "Lisboa",
      zipCode: "1000-001",
      contactType: "individual",
      companyRegistration: "",
      companyCode: "",
      companyRCBECode: "",
      companySocialCapital: "",
      userId: 1, // Assumindo que existe um usuário com ID 1
    },
  });

  // Criar imóvel de exemplo
  const property = await prisma.properties.upsert({
    where: { id: 1 },
    update: {},
    create: {
      fraction: "A",
      floor: "3º",
      destination: "Habitação",
      district: "Lisboa",
      neighborhood: "Centro",
      address: "Rua Principal",
      number: "123",
      city: "Lisboa",
      postalCode: "1000-000",
      matrixRegistration: "1234",
      buildingDescriptionNumber: "5678",
      buildingDescriptionRegistry: "Lisboa",
      luNumber: "9012",
      luDate: new Date(),
      luIssuer: "Câmara Municipal de Lisboa",
      ecLetter: "B",
      ecNumber: "3456",
      ecValidUntil: new Date("2025-12-31"),
      chargesType: "Hipoteca",
      chargesBank: "Banco Exemplo",
      chargesAP: "AP123",
      chargesDate: new Date(),
      userId: 1, // Assumindo que existe um usuário com ID 1
    },
  });

  console.log(`Created contact: ${contact1.name}`);
  console.log(`Created contact: ${contact2.name}`);
  console.log(`Created property: ${property.address}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
