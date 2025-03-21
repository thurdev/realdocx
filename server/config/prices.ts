import { TransactionSubType } from "~/server/utils/types";

export const PRICES = {
  CONTRACT_CREATION: Number(process.env.CONTRACT_CREATION_PRICE || 0.5),
  CONTRACT_EDIT: Number(process.env.CONTRACT_EDIT_PRICE || 0.25),
  CONTRACT_DOWNLOAD: Number(process.env.CONTRACT_DOWNLOAD_PRICE || 0.15),
} as const;

type DebitTransactionType = Extract<
  TransactionSubType,
  TransactionSubType.contractCreation | TransactionSubType.contractEdit | TransactionSubType.contractDownload
>;

// Função helper para criar transação de débito
export const createDebitTransaction = async (prisma: any, {
  userId,
  contractId,
  subType,
  customAmount,
}: {
  userId: number;
  contractId?: number;
  subType: DebitTransactionType;
  customAmount?: number;
}) => {
  // Se houver um valor customizado, use-o, caso contrário use o valor padrão do mapa
  const amount = customAmount ?? (() => {
    const priceMap: Record<DebitTransactionType, number> = {
      [TransactionSubType.contractCreation]: PRICES.CONTRACT_CREATION,
      [TransactionSubType.contractEdit]: PRICES.CONTRACT_EDIT,
      [TransactionSubType.contractDownload]: PRICES.CONTRACT_DOWNLOAD,
    };
    return priceMap[subType];
  })();

  return prisma.transactions.create({
    data: {
      amount,
      type: 'debit',
      subType,
      userId,
      ...(contractId ? { contractId } : {}),
    },
  });
}; 