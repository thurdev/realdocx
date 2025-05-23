<template>
  <div class="">
    <h1 class="text-2xl font-bold">
      {{ $t("sidebar.wallet") }}
    </h1>
    <Tabs default-value="overview" class="mt-4" v-model="currentTab">
      <TabsList class="border border-b">
        <TabsTrigger value="overview">{{ $t("wallet.overview") }}</TabsTrigger>
        <TabsTrigger value="addCard">{{ $t("wallet.addCard") }}</TabsTrigger>
        <TabsTrigger value="billingHistory">{{
          $t("wallet.billingHistory")
        }}</TabsTrigger>
      </TabsList>

      <!-- Overview Tab -->
      <TabsContent value="overview" class="p-8">
        <div class="w-full">
          <h2 class="text-xl font-bold">{{ $t("wallet.payAsYouGo") }}</h2>
          <div class="mt-4 flex flex-col gap-2">
            <p>{{ $t("wallet.creditBalance") }}</p>
            <span class="text-3xl"
              >€{{ wallet.balance.value.toFixed(2) || "0.00" }}</span
            >
            <Button
              :class="{
                'w-[152px]': paymentMethods.length > 0,
                'w-[256px]': paymentMethods.length === 0,
              }"
              size="sm"
              variant="outline"
              @click="
                () =>
                  paymentMethods.length > 0
                    ? (showAddCreditsDialog = true)
                    : (showAddCardDialog = true)
              "
            >
              <template v-if="paymentMethods.length === 0">
                {{ $t("wallet.addPaymentMethod") }}
              </template>
              <template v-else>
                {{ $t("wallet.addCreditBalance") }}
              </template>
            </Button>
          </div>

          <div class="mt-8">
            <div class="flex justify-between">
              <p>{{ $t("wallet.creditsUsed") }}</p>
              <p>EUR</p>
            </div>

            <div class="flex items-center gap-4">
              <Progress v-model="progress" class="w-[100%]" />
              <div class="flex gap-1">
                <span
                  >€{{ wallet.totalDebits.value?.toFixed(2) || "0.00" }}</span
                >
                <span>/</span>
                <span
                  >€{{ wallet.totalCredits.value?.toFixed(2) || "0.00" }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Add Card Tab -->
      <TabsContent value="addCard" class="p-8">
        <div class="w-full">
          <h2 class="text-xl font-bold mb-6">
            {{ $t("wallet.paymentMethods") }}
          </h2>
          <Button
            class="w-[152px]"
            size="sm"
            variant="outline"
            @click="showAddCardDialog = true"
          >
            {{ $t("wallet.addCard") }}
          </Button>

          <div class="mt-4">
            <div
              v-for="pMethod in paymentMethods"
              :key="pMethod.id"
              class="max-w-[256px]"
            >
              <div
                class="flex items-center justify-between mb-4 border rounded p-2"
              >
                <div class="flex items-center gap-2">
                  <img
                    :src="`https://cdn.openai.com/API/images/payment-methods/${pMethod.card.brand}.svg`"
                    class="h-4"
                  />
                  <span>{{ pMethod.card.last4 }}</span>
                </div>
                <Button
                  variant="link"
                  size="sm"
                  @click="handleRemoveCard(pMethod.id)"
                >
                  <template v-if="isLoadingRemoveCard">
                    <Loader2 class="h-4 w-4 animate-spin" />
                    {{ $t("wallet.removing") }}
                  </template>
                  <template v-else>
                    {{ $t("wallet.remove") }}
                  </template>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <!-- Billing History Tab -->
      <TabsContent value="billingHistory" class="p-8">
        <div class="w-full">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">{{ $t("wallet.billingHistory") }}</h2>
            <p class="text-gray-600">
              {{ $t("wallet.totalSpent") }}: €{{ totalSpent.toFixed(2) }}
            </p>
          </div>

          <DataTable :columns="transactionColumns" :data="recentTransactions" />

          <div
            v-if="transactions.pagination.pages > 1"
            class="mt-4 flex justify-center"
          >
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === 1"
              @click="changePage(currentPage - 1)"
            >
              {{ $t("wallet.previous") }}
            </Button>
            <span class="mx-4 flex items-center">
              {{
                $t("wallet.page", [currentPage, transactions.pagination.pages])
              }}
            </span>
            <Button
              variant="outline"
              size="sm"
              :disabled="currentPage === transactions.pagination.pages"
              @click="changePage(currentPage + 1)"
            >
              {{ $t("wallet.next") }}
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <!-- Add Credits Dialog -->
    <Dialog
      :open="showAddCreditsDialog"
      @update:open="showAddCreditsDialog = false"
    >
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ $t("wallet.addCredits") }}</DialogTitle>
          <DialogDescription>
            {{ $t("wallet.addCreditsDescription") }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="amount">{{ $t("wallet.amount") }}</Label>
            <Input
              id="amount"
              type="number"
              v-model="creditAmount"
              :placeholder="$t('wallet.enterAmount')"
              class="col-span-3"
            />
          </div>
          <div class="grid gap-2">
            <Label for="card">{{ $t("wallet.paymentMethod") }}</Label>
            <Select v-model="selectedCard">
              <SelectTrigger class="w-full">
                <SelectValue :placeholder="$t('wallet.selectCard')" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="pMethod in paymentMethods"
                  :value="pMethod.id"
                  :key="pMethod.id"
                >
                  <span class="flex items-center">
                    <img
                      :src="`https://cdn.openai.com/API/images/payment-methods/${pMethod.card.brand}.svg`"
                      class="h-4 mr-2"
                    />ending in
                    {{ pMethod.card.last4 }}
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
                {{ $t("wallet.processing") }}
              </div>
            </template>
            <template v-else>
              {{ $t("wallet.addCredits") }}
            </template>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add card dialog -->
    <Dialog :open="showAddCardDialog" @update:open="showAddCardDialog = false">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{{ $t("wallet.addCard") }}</DialogTitle>
          <DialogDescription>
            {{ $t("wallet.addCardDescription") }}
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div id="cardElement" class="border p-4 rounded-md"></div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            @click="handleAddCard"
            :disabled="isLoadingCard"
          >
            <template v-if="isLoadingCard">
              <div class="flex items-center gap-2">
                <Loader2 class="h-4 w-4 animate-spin" />
                {{ $t("wallet.processing") }}
              </div>
            </template>
            <template v-else>
              {{ $t("wallet.saveCard") }}
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
  colorMode: "light",
});

import { loadStripe } from "@stripe/stripe-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast/use-toast";
import { Loader2 } from "lucide-vue-next";
import type { ColumnDef } from "@tanstack/vue-table";
import { useWallet } from "~/composable/useWallet";
const { $t } = useNuxtApp();
const wallet = useWallet();
// Estado
const currentPage = ref(1);
const showAddCreditsDialog = ref(false);
const showAddCardDialog = ref(false);
const creditAmount = ref<number>();
const selectedCard = ref<string>();
const isLoading = ref(false);
const isLoadingCard = ref(false);
const isLoadingRemoveCard = ref(false);
const { toast } = useToast();

const currentTab = ref("overview");

const transactions = ref({
  transactions: [] as Transaction[],
  pagination: {
    total: 0,
    pages: 1,
    currentPage: 1,
    perPage: 10,
  },
});

const paymentMethods = ref<
  {
    id: string;
    object: string;
    allow_redisplay: string;
    billing_details: {
      address: {
        city: string | null;
        country: string | null;
        line1: string | null;
        line2: string | null;
        postal_code: string | null;
        state: string | null;
      };
      email: string | null;
      name: string | null;
      phone: string | null;
    };
    card: {
      brand: string;
      checks: {
        address_line1_check: string | null;
        address_postal_code_check: string;
        cvc_check: string;
      };
      country: string;
      display_brand: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      funding: string;
      generated_from: string | null;
      last4: string;
      networks: {
        available: string[];
        preferred: string | null;
      };
      regulated_status: string;
      three_d_secure_usage: {
        supported: boolean;
      };
      wallet: string | null;
    };
    created: number;
    customer: string;
    livemode: boolean;
    metadata: {};
    radar_options: {};
    type: string;
  }[]
>([]);

// Computed
const progress = computed(() => {
  if (!wallet.totalCredits.value) return 0;
  return (wallet.totalDebits.value / wallet.totalCredits.value) * 100;
});

const recentTransactions = computed(() => transactions.value.transactions);

const totalSpent = computed(() => {
  return recentTransactions.value
    .filter((transaction) => transaction.type === "debit")
    .reduce((total, transaction) => total + transaction.amount, 0);
});

// Definir tipo local para transações:
type Transaction = {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  subType?: string;
};

// Colunas para as tabelas
const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "createdAt",
    header: () => $t("wallet.transactions.date"),
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "type",
    header: () => $t("wallet.transactions.type"),
    cell: ({ row }) =>
      row.original.type === "credit"
        ? $t("wallet.transactions.creditAdded")
        : $t("wallet.transactions.creditUsed"),
  },
  {
    accessorKey: "amount",
    header: () => $t("wallet.transactions.amount"),
    cell: ({ row }) => `€${row.original.amount.toFixed(2)}`,
  },
  {
    accessorKey: "contract",
    header: () => $t("wallet.transactions.description"),
    cell: ({ row }) => {
      return row.original.subType;
    },
  },
];

// Funções auxiliares
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-PT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const loadTransactions = async (page = 1) => {
  try {
    transactions.value = await $fetch("/api/wallet/transactions", {
      params: { page },
    });
    currentPage.value = page;
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
};

const loadPaymentMethods = async () => {
  try {
    paymentMethods.value = await $fetch("/api/stripe/payment-methods");
  } catch (error) {
    console.error("Error loading payment methods:", error);
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
    const response = await $fetch("/api/wallet/add-credits", {
      method: "POST",
      body: {
        amount: creditAmount.value,
        paymentMethodId: selectedCard.value,
      },
    }).catch((err) => {
      console.error("Error adding credits:", err);
      toast({
        title: $t("shared.error"),
        description: $t("endpoints.errors.addCredits"),
        variant: "errors",
      });
    });

    // Recarregar dados
    await Promise.all([wallet.fetchBalance(), loadTransactions()]);

    // Simular loading por 2s
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Fechar dialog e limpar campos
    showAddCreditsDialog.value = false;
    creditAmount.value = undefined;
    selectedCard.value = undefined;

    // Mostrar mensagem de sucesso
    toast({
      title: $t("shared.success"),
      description: `€${response.transaction.amount.toFixed(2)} ${$t(
        "wallet.addCreditBalance"
      )}`,
      variant: "success",
    });
  } catch (error) {
    console.error("Error adding credits:", error);
    // Mostrar mensagem de erro
    toast({
      title: $t("shared.error"),
      description: $t("endpoints.errors.addCredits"),
      variant: "errors",
    });
  } finally {
    isLoading.value = false;
  }
};

const { STRIPE_PUBLIC_KEY } = await $fetch<{ STRIPE_PUBLIC_KEY: string }>(
  "/api/config"
);
const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
let elements: any;

// Carregar dados iniciais
onMounted(async () => {
  await Promise.all([
    wallet.fetchBalance(),
    loadTransactions(),
    loadPaymentMethods(),
  ]);
});

watch(
  () => showAddCardDialog.value,
  (value) => {
    if (value) {
      if (stripe) {
        nextTick(() => {
          elements = stripe.elements();
          const cardElement = elements.create("card");
          cardElement.mount("#cardElement");
        });
      }
    }
  }
);

const handleAddCard = async () => {
  isLoadingCard.value = true;
  if (stripe) {
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement("card"),
    });
    if (error) {
      console.error("Error creating payment method:", error);
      toast({
        title: $t("shared.error"),
        description: $t("endpoints.errors.addCard"),
        variant: "errors",
      });
      return;
    }
    if (paymentMethod?.id) {
      $fetch("/api/stripe/payment-methods", {
        method: "POST",
        body: {
          paymentMethodId: paymentMethod.id,
        },
      })
        .then(() => {
          // Recarregar dados
          loadPaymentMethods();
          // Fechar dialog e limpar campos
          showAddCardDialog.value = false;
          // Mostrar mensagem de sucesso
          toast({
            title: $t("shared.success"),
            description: $t("wallet.cardAdded"),
            variant: "success",
          });
        })
        .catch((error) => {
          console.error("Error adding card:", error);
          // Mostrar mensagem de erro
          toast({
            title: $t("shared.error"),
            description: $t("endpoints.errors.addCard"),
            variant: "errors",
          });
        });
    }
    isLoadingCard.value = false;
  }
};

const handleRemoveCard = (id: string) => {
  isLoadingRemoveCard.value = true;
  $fetch("/api/stripe/payment-methods", {
    method: "DELETE",
    body: { paymentMethodId: id },
  })
    .then(() => {
      // Recarregar dados
      loadPaymentMethods();
      // Mostrar mensagem de sucesso
      toast({
        title: $t("shared.success"),
        description: $t("wallet.cardRemoved"),
        variant: "success",
      });
      isLoadingRemoveCard.value = false;
    })
    .catch((error) => {
      console.error("Error removing card:", error);
      // Mostrar mensagem de erro
      toast({
        title: $t("shared.error"),
        description: $t("endpoints.errors.removeCard"),
        variant: "errors",
      });
    });
};
</script>
