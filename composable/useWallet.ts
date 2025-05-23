interface WalletResponse {
  balance?: number;
  error?: string;
  totalCredits?: number;
  totalDebits?: number;
}

const _fetchWallet = async () => {
  const response = await $fetch<WalletResponse>("/api/wallet/balance");
  if (response.error) {
    console.error("Error fetching balance:", response.error);
    return {
      balance: 0,
      totalCredits: 0,
      totalDebits: 0,
    };
  } else if (response.balance !== undefined) {
    return {
      balance: response.balance,
      totalCredits: response.totalCredits,
      totalDebits: response.totalDebits,
    };
  }
  return {
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
  };
};

const _fetchTotals = async () => {
  const response = await $fetch<WalletResponse>("/api/wallet/totals");
  return response;
};

export const useWallet = () => {
  const balance = useState<number>("walletBalance", () => 0);
  const totalCredits = useState<number>("totalCredits", () => 0);
  const totalDebits = useState<number>("totalDebits", () => 0);

  const fetchBalance = async () => {
    const {
      balance: balanceValue,
      totalCredits: totalCreditsValue,
      totalDebits: totalDebitsValue,
    } = await _fetchWallet();
    if (balanceValue !== undefined) {
      balance.value = balanceValue;
    }
    if (totalCreditsValue !== undefined) {
      totalCredits.value = totalCreditsValue;
    }
    if (totalDebitsValue !== undefined) {
      totalDebits.value = totalDebitsValue;
    }
  };

  const hasBalance = (amount: number) => {
    return balance.value >= amount;
  };

  return {
    balance,
    totalCredits,
    totalDebits,
    fetchBalance,
    hasBalance,
  };
};
