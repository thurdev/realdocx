<template>
  <div class="">
    <h1 class="text-2xl font-bold">
      {{ $t("sidebar.wallet") }}
    </h1>
    <Tabs default-value="overview" class="mt-4">
      <TabsList class="border border-b">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="addCard">Add Card</TabsTrigger>
        <TabsTrigger value="billingHistory">Billing History</TabsTrigger>
      </TabsList>

      <!-- Overview Tab -->
      <TabsContent value="overview" class="p-8">
        <div class="w-full">
          <h2 class="text-xl font-bold">Pay as you go</h2>
          <div class="mt-4 flex flex-col gap-2">
            <p>Credit balance</p>
            <span class="text-3xl">€{{ walletData.balance?.toFixed(2) || '0.00' }}</span>
            <Button class="w-[152px]" size="sm" variant="outline" @click="showAddCreditsDialog = true">
              Add credit balance
            </Button>
          </div>

          <div class="mt-8">
            <div class="flex justify-between">
              <p>Credits used</p>
              <p>EUR</p>
            </div>

            <div class="flex items-center gap-4">
              <Progress v-model="progress" class="w-[100%]" />
              <div class="flex gap-1">
                <span>€{{ walletData.totalDebits?.toFixed(2) || '0.00' }}</span>
                <span>/</span>
                <span>€{{ walletData.totalCredits?.toFixed(2) || '0.00' }}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Add Card Tab -->
      <TabsContent value="addCard" class="p-8">
        <div class="w-full">
          <h2 class="text-xl font-bold mb-6">Add Payment Method</h2>
          <p class="text-gray-600 mb-4">Coming soon...</p>
        </div>
      </TabsContent>

      <!-- Billing History Tab -->
      <TabsContent value="billingHistory" class="p-8">
        <div class="w-full">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">Billing History</h2>
            <p class="text-gray-600">Total Spent: €{{ billingHistory.totalSpent?.toFixed(2) || '0.00' }}</p>
          </div>

          <DataTable 
            :columns="transactionColumns" 
            :data="recentTransactions" 
          />

          <div v-if="transactions.pagination.pages > 1" class="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              Previous
            </Button>
            <span class="mx-4 flex items-center">
              Page {{ currentPage }} of {{ transactions.pagination.pages }}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === transactions.pagination.pages"
              @click="changePage(currentPage + 1)"
            >
              Next
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Add Credits Dialog -->
    <Dialog :open="showAddCreditsDialog" @update:open="showAddCreditsDialog = false">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Credits</DialogTitle>
          <DialogDescription>
            Add credits to your wallet using your saved payment method.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="amount">Amount (€)</Label>
            <Input
              id="amount"
              type="number"
              v-model="creditAmount"
              placeholder="Enter amount"
              class="col-span-3"
            />
          </div>
          <div class="grid gap-2">
            <Label for="card">Payment Method</Label>
            <Select v-model="selectedCard">
              <SelectTrigger class="w-full">
                <SelectValue placeholder="Select a card" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card1">
                  <span class="flex items-center">
                    <img src="https://cdn.openai.com/API/images/payment-methods/visa.svg" class="h-4 mr-2" />
                    Visa ending in 4242
                  </span>
                </SelectItem>
                <SelectItem value="card2">
                  <span class="flex items-center">
                    <img src="https://cdn.openai.com/API/images/payment-methods/mastercard.svg" class="h-4 mr-2" />
                    Mastercard ending in 8888
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" @click="handleAddCredits" :disabled="isLoading">
            <template v-if="isLoading">
              <div class="flex items-center gap-2">
                <Loader2 class="h-4 w-4 animate-spin" />
                Processando...
              </div>
            </template>
            <template v-else>
              Adicionar Créditos
            </template>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2 } from 'lucide-vue-next';

// Estado
const currentPage = ref(1);
const showAddCreditsDialog = ref(false);
const creditAmount = ref<number>();
const selectedCard = ref<string>();
const isLoading = ref(false);
const { toast } = useToast();

// Dados da wallet
const walletData = ref({
  balance: 0,
  totalCredits: 0,
  totalDebits: 0,
});

const transactions = ref({
  transactions: [],
  pagination: {
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 10,
  },
});

const billingHistory = ref({
  billingHistory: [],
  totalSpent: 0,
});

// Computed
const progress = computed(() => {
  if (!walletData.value.totalCredits) return 0;
  return (walletData.value.totalDebits / walletData.value.totalCredits) * 100;
});

const recentTransactions = computed(() => transactions.value.transactions);

// Colunas para as tabelas
const transactionColumns = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => row.original.type === 'credit' ? 'Credit Added' : 'Credit Used',
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => `€${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "contract",
    header: "Description",
    cell: ({ row }) => row.original.contract ? `Contract #${row.original.contract.id}` : '-',
  },
];

// Funções auxiliares
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Funções para carregar dados
const loadWalletData = async () => {
  try {
    walletData.value = await $fetch('/api/wallet/balance');
  } catch (error) {
    console.error('Error loading wallet data:', error);
  }
};

const loadTransactions = async (page = 1) => {
  try {
    transactions.value = await $fetch('/api/wallet/transactions', {
      params: { page },
    });
    currentPage.value = page;
  } catch (error) {
    console.error('Error loading transactions:', error);
  }
};

// Funções de paginação
const changePage = (page: number) => {
  loadTransactions(page);
};

// Função para adicionar créditos
const handleAddCredits = async () => {
  if (!creditAmount.value || !selectedCard.value) return;

  try {
    isLoading.value = true;
    // Chamar o endpoint para adicionar créditos
    const response = await $fetch('/api/wallet/add-credits', {
      method: 'POST',
      body: {
        amount: creditAmount.value,
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    // Recarregar dados
    await Promise.all([
      loadWalletData(),
      loadTransactions(),
    ]);
    
    // Simular loading por 2s
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Fechar dialog e limpar campos
    showAddCreditsDialog.value = false;
    creditAmount.value = undefined;
    selectedCard.value = undefined;

    // Mostrar mensagem de sucesso
    toast({
      title: "Sucesso",
      description: `€${response.transaction.amount.toFixed(2)} adicionados à sua carteira`,
      variant: "success"
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    // Mostrar mensagem de erro
    toast({
      title: "Erro",
      description: "Falha ao adicionar créditos. Tente novamente.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};

// Carregar dados iniciais
onMounted(async () => {
  await Promise.all([
    loadWalletData(),
    loadTransactions(),
  ]);
});
</script>
