interface WalletResponse {
  balance?: number;
  error?: string;
  totalCredits?: number;
  totalDebits?: number;
}

const _fetchBalance = async () => {
  const response = await $fetch<WalletResponse>("/api/wallet/balance");
  if (response.error) {
    console.error("Error fetching balance:", response.error);
    return 0;
  } else if (response.balance !== undefined) {
    return response.balance;
  }
  return 0;
};

export const useWallet = () => {
  const balance = useState<number>("walletBalance", () => 0);
  const totalCredits = useState<number>("totalCredits", () => 0);
  const totalDebits = useState<number>("totalDebits", () => 0);

  const fetchBalance = async () => {
    const fetchedBalance = await _fetchBalance();
    if (fetchedBalance !== undefined) {
      balance.value = fetchedBalance;
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
