import prisma from "~/lib/prisma";

export const getWalletBalance = async (userId: number) => {
  const credits = await prisma.transactions.aggregate({
    where: {
      userId,
      type: "credit",
    },
    _sum: {
      amount: true,
    },
  });

  const debits = await prisma.transactions.aggregate({
    where: {
      userId,
      type: "debit",
    },
    _sum: {
      amount: true,
    },
  });

  return {
    credits: credits._sum.amount,
    debits: debits._sum.amount,
    balance: (credits._sum.amount || 0) - (debits._sum.amount || 0),
  };
};

export const registerDebit = async (
  userId: number,
  amount: number,
  subType: TransactionSubType
) => {
  await prisma.transactions.create({
    data: {
      userId,
      amount,
      type: "debit",
      subType,
    },
  });
};
