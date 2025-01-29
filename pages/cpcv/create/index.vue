<template>
  <div class="flex w-full h-[auto] gap-4 flex-col md:flex-row">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel class="min-w-[400px]">
        <!-- Document generation center page -->
        <div
          class="min-w-[400px] flex-1 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 dark:bg-zinc-900 dark:text-white"
        >
          <div class="flex flex-col">
            <label class="text-[24px] font-bold">Criar CPCV</label>

            <span class="text-gray-400"
              >Crie documentos de CPCV com facilidade. Preencha os campos abaixo
              e clique em "Criar CPCV" para gerar o documento.</span
            >
          </div>
          <!-- <form class="pt-4" @submit.prevent="generateDocument">
            <div class="flex gap-4">
              <div class="flex flex-col gap-2 flex-1">
                <Label class="font-medium">Primeiro Ortogante</Label>
                <Label>Nome</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].nome"
                  type="text"
                  placeholder="Nome"
                  class="Input"
                />
                <Label>Freguesia</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].freguesia"
                  type="text"
                  placeholder="Freguesia"
                  class="Input"
                />
                <Label>Concelho</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].concelho"
                  type="text"
                  placeholder="Concelho"
                  class="Input"
                />
                <Label>NIF</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].nif"
                  type="text"
                  placeholder="NIF"
                  class="Input"
                />
                <Label>Número do Cartão de Cidadão</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].cartaoCidadao.number"
                  type="text"
                  placeholder="Número do Cartão de Cidadão"
                  class="Input"
                />
                <Label>Data de Expiração</Label>
                <Input
                  v-model="
                    payload.primeiroOrtogantes[0].cartaoCidadao.expirationDate
                  "
                  type="date"
                  placeholder="Data de Expiração"
                  class="Input"
                />
                <Label>Estado Civil</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].estadoCivil"
                  type="text"
                  placeholder="Estado Civil"
                  class="Input"
                />
                <Label>Casado Sob Regime</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].casadoSobRegime"
                  type="text"
                  placeholder="Casado Sob Regime"
                  class="Input"
                />
                <Label>Casado Com Domicílio</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].casadoComDomicilio"
                  type="text"
                  placeholder="Casado Com Domicílio"
                  class="Input"
                />
                <Label>Matrícula Comercial</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].matriculaComercial"
                  type="text"
                  placeholder="Matrícula Comercial"
                  class="Input"
                />
                <Label>Certidão Permanente</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].certidaoPermanente"
                  type="text"
                  placeholder="Certidão Permanente"
                  class="Input"
                />
                <Label>Código RCBE</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].codigoRCBE"
                  type="text"
                  placeholder="Código RCBE"
                  class="Input"
                />
                <Label>Sede RCBE</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].sedeRCBE"
                  type="text"
                  placeholder="Sede RCBE"
                  class="Input"
                />
                <Label>Capital Social</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].capitalSocial"
                  type="number"
                  placeholder="Capital Social"
                  class="Input"
                />
                <Label>Ato</Label>
                <Input
                  v-model="payload.primeiroOrtogantes[0].acto"
                  type="text"
                  placeholder="Ato"
                  class="Input"
                />
              </div>
              <div class="flex flex-col gap-2 flex-1">
                <Label class="font-medium">Segundo Ortogante</Label>
                <Label>Nome</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].nome"
                  type="text"
                  placeholder="Nome"
                  class="Input"
                />
                <Label>Freguesia</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].freguesia"
                  type="text"
                  placeholder="Freguesia"
                  class="Input"
                />
                <Label>Concelho</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].concelho"
                  type="text"
                  placeholder="Concelho"
                  class="Input"
                />
                <Label>NIF</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].nif"
                  type="text"
                  placeholder="NIF"
                  class="Input"
                />
                <Label>Número do Cartão de Cidadão</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].cartaoCidadao.number"
                  type="text"
                  placeholder="Número do Cartão de Cidadão"
                  class="Input"
                />
                <Label>Data de Expiração</Label>
                <Input
                  v-model="
                    payload.segundoOrtogantes[0].cartaoCidadao.expirationDate
                  "
                  type="date"
                  placeholder="Data de Expiração"
                  class="Input"
                />
                <Label>Estado Civil</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].estadoCivil"
                  type="text"
                  placeholder="Estado Civil"
                  class="Input"
                />
                <Label>Casado Sob Regime</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].casadoSobRegime"
                  type="text"
                  placeholder="Casado Sob Regime"
                  class="Input"
                />
                <Label>Casado Com Domicílio</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].casadoComDomicilio"
                  type="text"
                  placeholder="Casado Com Domicílio"
                  class="Input"
                />
                <Label>Matrícula Comercial</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].matriculaComercial"
                  type="text"
                  placeholder="Matrícula Comercial"
                  class="Input"
                />
                <Label>Certidão Permanente</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].certidaoPermanente"
                  type="text"
                  placeholder="Certidão Permanente"
                  class="Input"
                />
                <Label>Código RCBE</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].codigoRCBE"
                  type="text"
                  placeholder="Código RCBE"
                  class="Input"
                />
                <Label>Sede RCBE</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].sedeRCBE"
                  type="text"
                  placeholder="Sede RCBE"
                  class="Input"
                />
                <Label>Capital Social</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].capitalSocial"
                  type="number"
                  placeholder="Capital Social"
                  class="Input"
                />
                <Label>Ato</Label>
                <Input
                  v-model="payload.segundoOrtogantes[0].acto"
                  type="text"
                  placeholder="Ato"
                  class="Input"
                />
              </div>
            </div>

            <div class="flex flex-col gap-2 mt-4">
              <Label class="font-medium">Cláusulas</Label>
              <Label>Primeiro Ortogante</Label>
              <Input
                v-model="payload.clauses.values.firstGrantors"
                type="text"
                placeholder="Primeiro Ortogante"
                class="Input"
              />
              <Label>Segundo Ortogante</Label>
              <Input
                v-model="payload.clauses.values.secondGrantors"
                type="text"
                placeholder="Segundo Ortogante"
                class="Input"
              />
              <Label>Composição da Primeira Cláusula (Letra)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseCompositionLetter"
                type="text"
                placeholder="Composição da Primeira Cláusula (Letra)"
                class="Input"
              />
              <Label>Composição da Primeira Cláusula (Andar)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseCompositionFloor"
                type="text"
                placeholder="Composição da Primeira Cláusula (Andar)"
                class="Input"
              />
              <Label>Destino da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseDestination"
                type="text"
                placeholder="Destino da Primeira Cláusula"
                class="Input"
              />
              <Label>Rua da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseStreet"
                type="text"
                placeholder="Rua da Primeira Cláusula"
                class="Input"
              />
              <Label>Freguesia da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseFreguesia"
                type="text"
                placeholder="Freguesia da Primeira Cláusula"
                class="Input"
              />
              <Label>Concelho da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseConcelho"
                type="text"
                placeholder="Concelho da Primeira Cláusula"
                class="Input"
              />
              <Label>Tipo de Artigo da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseArticleType"
                type="text"
                placeholder="Tipo de Artigo da Primeira Cláusula"
                class="Input"
              />
              <Label>Número de Artigo da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseArticleNumber"
                type="text"
                placeholder="Número de Artigo da Primeira Cláusula"
                class="Input"
              />
              <Label>Freguesia do Artigo da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseArticleFreguesia"
                type="text"
                placeholder="Freguesia do Artigo da Primeira Cláusula"
                class="Input"
              />
              <Label>Número Predial da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClausePredialNumber"
                type="text"
                placeholder="Número Predial da Primeira Cláusula"
                class="Input"
              />
              <Label>Freguesia Predial da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClausePredialFreguesia"
                type="text"
                placeholder="Freguesia Predial da Primeira Cláusula"
                class="Input"
              />
              <Label>Conservatória Predial da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClausePredialConservatoria"
                type="text"
                placeholder="Conservatória Predial da Primeira Cláusula"
                class="Input"
              />
              <Label>Data de Registro Predial da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClausePredialRegisteredAt"
                type="date"
                placeholder="Data de Registro Predial da Primeira Cláusula"
                class="Input"
              />
              <Label
                >Número de Licença de Utilização da Primeira Cláusula</Label
              >
              <Input
                v-model="
                  payload.clauses.values.firstClauseLicenseUtilizationNumber
                "
                type="text"
                placeholder="Número de Licença de Utilização da Primeira Cláusula"
                class="Input"
              />
              <Label>Data de Emissão da Licença da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseLicenseIssuedAt"
                type="date"
                placeholder="Data de Emissão da Licença da Primeira Cláusula"
                class="Input"
              />
              <Label>Emitido por (Licença da Primeira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseLicenseIssuedBy"
                type="text"
                placeholder="Emitido por (Licença da Primeira Cláusula)"
                class="Input"
              />
              <Label>Opções de Licença da Primeira Cláusula</Label>
              <Input
                v-model="payload.clauses.values.firstClauseLicenseOptions"
                type="text"
                placeholder="Opções de Licença da Primeira Cláusula"
                class="Input"
              />
              <Label
                >Número de Certificação Energética da Primeira Cláusula</Label
              >
              <Input
                v-model="
                  payload.clauses.values.firstClauseEnergyCertificationNumber
                "
                type="text"
                placeholder="Número de Certificação Energética da Primeira Cláusula"
                class="Input"
              />
              <Label
                >Validade da Certificação Energética da Primeira Cláusula</Label
              >
              <Input
                v-model="
                  payload.clauses.values
                    .firstClauseEnergyCertificationValidUntil
                "
                type="date"
                placeholder="Validade da Certificação Energética da Primeira Cláusula"
                class="Input"
              />
              <Label
                >Letra da Certificação Energética da Primeira Cláusula</Label
              >
              <Input
                v-model="
                  payload.clauses.values.firstClauseEnergyCertificationLetter
                "
                type="text"
                placeholder="Letra da Certificação Energética da Primeira Cláusula"
                class="Input"
              />
              <Label
                >Extra da Certificação Energética da Primeira Cláusula</Label
              >
              <Input
                v-model="
                  payload.clauses.values.firstClauseEnergyCertificationExtra
                "
                type="text"
                placeholder="Extra da Certificação Energética da Primeira Cláusula"
                class="Input"
              />
              <Label>Hipoteca a Favor de (Primeira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseMortgageInFavorOf"
                type="text"
                placeholder="Hipoteca a Favor de (Primeira Cláusula)"
                class="Input"
              />
              <Label>Hipoteca A (Primeira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseMortgageA"
                type="number"
                placeholder="Hipoteca A (Primeira Cláusula)"
                class="Input"
              />
              <Label>Hipoteca B (Primeira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.firstClauseMortgageB"
                type="number"
                placeholder="Hipoteca B (Primeira Cláusula)"
                class="Input"
              />
              <Label>Equipamentos na Propriedade (Segunda Cláusula)</Label>
              <Input
                v-model="
                  payload.clauses.values.secondClauseEquipmentsInTheProperty
                "
                type="text"
                placeholder="Equipamentos na Propriedade (Segunda Cláusula)"
                class="Input"
              />
              <Label>Preço Bruto (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClausePriceGross"
                type="number"
                placeholder="Preço Bruto (Terceira Cláusula)"
                class="Input"
              />
              <Label>Preço Bruto (Raw) (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseRawPriceGross"
                type="number"
                placeholder="Preço Bruto (Raw) (Terceira Cláusula)"
                class="Input"
              />
              <Label>Preço Líquido (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClausePriceLiquid"
                type="number"
                placeholder="Preço Líquido (Terceira Cláusula)"
                class="Input"
              />
              <Label>Preço Líquido (Raw) (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseRawPriceLiquid"
                type="number"
                placeholder="Preço Líquido (Raw) (Terceira Cláusula)"
                class="Input"
              />
              <Label>Data de Pagamento (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClausePaymentDate"
                type="date"
                placeholder="Data de Pagamento (Terceira Cláusula)"
                class="Input"
              />
              <Label>Entidade (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseEntity"
                type="text"
                placeholder="Entidade (Terceira Cláusula)"
                class="Input"
              />
              <Label>Referência (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseReference"
                type="text"
                placeholder="Referência (Terceira Cláusula)"
                class="Input"
              />
              <Label>Opcional (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseOptional"
                type="text"
                placeholder="Opcional (Terceira Cláusula)"
                class="Input"
              />
              <Label>Segundo Preço (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseSecondPrice"
                type="number"
                placeholder="Segundo Preço (Terceira Cláusula)"
                class="Input"
              />
              <Label>Segundo Preço (Raw) (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseSecondRawPrice"
                type="number"
                placeholder="Segundo Preço (Raw) (Terceira Cláusula)"
                class="Input"
              />
              <Input
                v-model="payload.clauses.values.thirdClauseThirdPrice"
                type="number"
                placeholder="Terceiro Preço (Terceira Cláusula)"
                class="Input"
              />
              <Label>Terceiro Preço (Raw) (Terceira Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.thirdClauseThirdRawPrice"
                type="number"
                placeholder="Terceiro Preço (Raw) (Terceira Cláusula)"
                class="Input"
              />
              <Label>Máximo de Dias para Pagar (Quinta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.fifthClauseMaxDaysToPay"
                type="number"
                placeholder="Máximo de Dias para Pagar (Quinta Cláusula)"
                class="Input"
              />
              <Label>Máximo de Dias para Pagar (Raw) (Quinta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.fifthClauseMaxRawDaysToPay"
                type="number"
                placeholder="Máximo de Dias para Pagar (Raw) (Quinta Cláusula)"
                class="Input"
              />
              <Label>Designação (Décima Sexta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.sixteenthDesignation"
                type="text"
                placeholder="Designação (Décima Sexta Cláusula)"
                class="Input"
              />
              <Label>NIF (Décima Sexta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.sixteenthNif"
                type="text"
                placeholder="NIF (Décima Sexta Cláusula)"
                class="Input"
              />
              <Label>Licença AMI (Décima Sexta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.sixteenthAMILicense"
                type="text"
                placeholder="Licença AMI (Décima Sexta Cláusula)"
                class="Input"
              />
              <Label>Primeiro Ortogante (Décima Sexta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.sixteenthFirstGrantors"
                type="text"
                placeholder="Primeiro Ortogante (Décima Sexta Cláusula)"
                class="Input"
              />
              <Label>Segundo Ortogante (Décima Sexta Cláusula)</Label>
              <Input
                v-model="payload.clauses.values.sixteenthSecondGrantors"
                type="text"
                placeholder="Segundo Ortogante (Décima Sexta Cláusula)"
                class="Input"
              />
              <Label>IBAN</Label>
              <Input
                v-model="payload.clauses.extraParams.iban"
                type="text"
                placeholder="IBAN"
                class="Input"
              />
              <Label>Banco</Label>
              <Input
                v-model="payload.clauses.extraParams.bank"
                type="text"
                placeholder="Banco"
                class="Input"
              />
            </div>
            <div class="flex justify-center mt-4">
              <Button
                variant="primary"
                type="submit"
                class="btn btn-primary w-full"
              >
                Criar CPCV
              </Button>
            </div>
          </form> -->
        </div></ResizablePanel
      >
      <!-- <ResizableHandle class="mr-2" /> -->
      <!-- <ResizablePanel class="min-w-[500px]">
        <div
          class="flex-1 bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 dark:bg-zinc-900 dark:text-white"
        >
          <div class="flex flex-col">
            <label class="text-[24px] font-bold">Live Preview</label
            ><span class="text-gray-400">
              Visualize e altere o documento de CPCV gerado em tempo real.</span
            >
          </div>
          <iframe class="w-full h-full" :src="fileUrl"></iframe></div
      ></ResizablePanel> -->
    </ResizablePanelGroup>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import axios from "axios";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const fileUrl = ref("");

const payload = {
  filename: "CPCV",
  primeiroOrtogantes: [
    {
      nome: "João Silva",
      freguesia: "Santa Maria",
      concelho: "Lisboa",
      nif: "123456789",
      cartaoCidadao: {
        number: "1234567890",
        expirationDate: "2025-12-31",
      },
      estadoCivil: "Solteiro",
      casadoSobRegime: "Comunhão de Bens",
      casadoComDomicilio: "Lisboa",
      matriculaComercial: "12345",
      certidaoPermanente: "67890",
      codigoRCBE: "112233",
      sedeRCBE: "Lisboa",
      capitalSocial: "100000",
      acto: "Compra e Venda",
    },
  ],
  segundoOrtogantes: [
    {
      nome: "Maria Oliveira",
      freguesia: "São João",
      concelho: "Porto",
      nif: "987654321",
      cartaoCidadao: {
        number: "0987654321",
        expirationDate: "2024-11-30",
      },
      estadoCivil: "Casada",
      casadoSobRegime: "Separação de Bens",
      casadoComDomicilio: "Porto",
      matriculaComercial: "54321",
      certidaoPermanente: "09876",
      codigoRCBE: "445566",
      sedeRCBE: "Porto",
      capitalSocial: "200000",
      acto: "Arrendamento",
    },
  ],
  clauses: {
    options: {
      licenseOptions: null,
      hasEquipmentsInTheProperty: true,
      willItBePaidByTheMediator: false,
      fifteenthClause: true,
    },
    values: {
      firstGrantors: "João Silva",
      secondGrantors: "Maria Oliveira",
      firstClauseCompositionLetter: "A",
      firstClauseCompositionFloor: "1",
      firstClauseDestination: "Residencial",
      firstClauseStreet: "Rua das Flores",
      firstClauseFreguesia: "Santa Maria",
      firstClauseConcelho: "Lisboa",
      firstClauseArticleType: "Urbano",
      firstClauseArticleNumber: "123",
      firstClauseArticleFreguesia: "Santa Maria",
      firstClausePredialNumber: "456",
      firstClausePredialFreguesia: "Santa Maria",
      firstClausePredialConservatoria: "Lisboa",
      firstClausePredialRegisteredAt: "2020-01-01",
      firstClauseLicenseUtilizationNumber: "789",
      firstClauseLicenseIssuedAt: "2019-12-31",
      firstClauseLicenseIssuedBy: "Câmara Municipal de Lisboa",
      firstClauseLicenseOptions: "N/A",
      firstClauseEnergyCertificationNumber: "123456",
      firstClauseEnergyCertificationValidUntil: "2025-12-31",
      firstClauseEnergyCertificationLetter: "B",
      firstClauseEnergyCertificationExtra: "N/A",
      firstClauseMortgageInFavorOf: "Banco ABC",
      firstClauseMortgageA: "100000",
      firstClauseMortgageB: "50000",
      secondClauseEquipmentsInTheProperty: "Sim",
      thirdClausePriceGross: "150000",
      thirdClauseRawPriceGross: "150000",
      thirdClausePriceLiquid: "140000",
      thirdClauseRawPriceLiquid: "140000",
      thirdClausePaymentDate: "2023-12-31",
      thirdClauseEntity: "Banco XYZ",
      thirdClauseReference: "REF123",
      thirdClauseOptional: "N/A",
      thirdClauseSecondPrice: "50000",
      thirdClauseSecondRawPrice: "50000",
      thirdClauseThirdPrice: "25000",
      thirdClauseThirdRawPrice: "25000",
      fifthClauseMaxDaysToPay: "30",
      fifthClauseMaxRawDaysToPay: "30",
      sixteenthDesignation: "Imobiliária ABC",
      sixteenthNif: "123456789",
      sixteenthAMILicense: "AMI12345",
      sixteenthFirstGrantors: "João Silva",
      sixteenthSecondGrantors: "Maria Oliveira",
    },
    extraParams: {
      iban: "PT50000201231234567890154",
      bank: "Banco XYZ",
    },
  },
};

let config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "http://178.62.110.208:4000/api/docx/generate",
  headers: {
    "Content-Type": "application/json",
  },
  data: JSON.stringify(payload),
};

axios
  .request(config)
  .then((response) => {
    // is a blob add to iframe
    // the file is in docx format convert to pdf
    const file = new Blob([response.data], { type: "application/pdf" });
    fileUrl.value = URL.createObjectURL(file);
  })
  .catch((error) => {
    console.log(error);
  });
</script>
