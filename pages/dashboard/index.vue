<template>
  <div class="space-y-8">
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">{{ $t("dashboard.welcome") }}</h2>
        <p class="text-muted-foreground">
          {{ $t("dashboard.overview") }}
        </p>
      </div>
      <DateRangeSelector v-model="dateRange" />
    </div>

    <!-- Cards de Estatísticas -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card class="hover:shadow-lg transition-all duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle class="text-sm font-medium">
            {{ $t("dashboard.totalContracts") }}
          </CardTitle>
          <i class="fa-light fa-file-contract text-muted-foreground text-2xl"></i>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.totalContracts }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newContracts }} {{ $t("dashboard.thisMonth") }}
          </p>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle class="text-sm font-medium">
            {{ $t("dashboard.totalProperties") }}
          </CardTitle>
          <i class="fa-light fa-building text-muted-foreground text-2xl"></i>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.totalProperties }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newProperties }} {{ $t("dashboard.thisMonth") }}
          </p>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle class="text-sm font-medium">
            {{ $t("dashboard.totalContacts") }}
          </CardTitle>
          <i class="fa-light fa-users text-muted-foreground text-2xl"></i>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">{{ stats.totalContacts }}</div>
          <p class="text-xs text-muted-foreground">
            +{{ stats.newContacts }} {{ $t("dashboard.thisMonth") }}
          </p>
        </CardContent>
      </Card>

      <Card class="hover:shadow-lg transition-all duration-300">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle class="text-sm font-medium">
            {{ $t("dashboard.walletBalance") }}
          </CardTitle>
          <i class="fa-light fa-wallet text-muted-foreground text-2xl"></i>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-bold">€ {{ stats.walletBalance.toFixed(2) }}</div>
          <p class="text-xs text-muted-foreground">
            {{ stats.walletDiff > 0 ? '+' : '' }}{{ stats.walletDiff.toFixed(2) }} {{ $t("dashboard.thisMonth") }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Gráficos -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>{{ $t("dashboard.overview") }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="chartData.datasets.every(dataset => dataset.data.every(d => d === 0))" class="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <i class="fa-light fa-chart-line text-4xl mb-4"></i>
            <p>{{ $t("dashboard.noDataAvailable") }}</p>
            <p class="text-sm">{{ $t("dashboard.startAddingData") }}</p>
          </div>
          <BarChart
            v-else
            :data="chartData"
            :options="chartOptions"
            class="h-[350px]"
          />
        </CardContent>
      </Card>

      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>{{ $t("dashboard.recentActivity") }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div v-if="!recentActivities.length" class="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <i class="fa-light fa-clock-rotate-left text-4xl mb-4"></i>
            <p>{{ $t("dashboard.noRecentActivity") }}</p>
            <p class="text-sm">{{ $t("dashboard.activitiesWillAppear") }}</p>
          </div>
          <div v-else class="space-y-8">
            <div v-for="(activity, i) in recentActivities" :key="i" class="flex items-center">
              <div :class="`${activity.color} rounded-full p-2 w-10 h-10 flex items-center justify-center`">
                <i :class="`fa-light ${activity.icon} text-white text-lg`"></i>
              </div>
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">
                  {{ activity.title }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ activity.description }}
                </p>
              </div>
              <div class="ml-auto font-medium text-sm">
                {{ moment(activity.time).locale('pt').fromNow() }}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Tour da dashboard -->
    <Tour
      :steps="dashboardTourSteps"
      tour-key="dashboard-tour"
      :auto-start="true"
      :show-trigger-button="false"
      @tour-complete="onTourComplete"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "authenticated",
  layout: "authenticated",
});

const { $t } = useNuxtApp();

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/charts';
import Tour from '@/components/ui/Tour.vue';
import DateRangeSelector from '@/components/wallet/DateRangeSelector.vue';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment/locale/en-gb';
import { useLanguage } from '~/composable/useLanguage';

const language = useLanguage();

// Configurar o moment.js para usar a linguagem do sistema
watch(language, (newLang) => {
  moment.locale(newLang);
}, { immediate: true });

interface WalletResponse {
  balance: number;
  totalCredits: number;
  totalDebits: number;
  error?: string;
}

interface TourStep {
  target: string;
  class?: string;
  content: string;
  placement: 'top' | 'right' | 'left' | 'bottom' | 'bottom-right';
}

interface Activity {
  title: string;
  description: string;
  time: string;
  color: string;
  icon: string;
}

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

interface OverviewResponse {
  chart: {
    labels: string[];
    datasets: ChartDataset[];
  };
  activities: Activity[];
  error?: string;
}

// Estado
const dateRange = ref({
  startDate: new Date(new Date().setDate(1)), // Primeiro dia do mês atual
  endDate: new Date(new Date().setMonth(new Date().getMonth() + 1, 0)) // Ultimo dia do mês atual
});

// Estatísticas
const stats = ref({
  totalContracts: 0,
  newContracts: 0,
  totalProperties: 0,
  newProperties: 0,
  totalContacts: 0,
  newContacts: 0,
  walletBalance: 0,
  walletDiff: 0
});

// Dados do gráfico
const chartData = ref<{
  labels: string[];
  datasets: ChartDataset[];
}>({
  labels: [$t('dashboard.totalContracts'), $t('dashboard.totalProperties'), $t('dashboard.totalContacts')],
  datasets: [
    {
      label: $t('dashboard.overview'),
      data: [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.5)', // Azul para contratos
        'rgba(16, 185, 129, 0.5)', // Verde para imóveis
        'rgba(249, 115, 22, 0.5)', // Laranja para contatos
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
        'rgb(249, 115, 22)',
      ],
      borderWidth: 1
    }
  ]
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};

// Atividades recentes
const recentActivities = ref<Activity[]>([]);


// Passos do tour
const dashboardTourSteps: TourStep[] = [
  {
    target: '.tour-target-sidebar-contacts',
    content: $t('dashboard.tour.contacts'),
    placement: 'bottom-right',
    class: 'bg-white'
  },
  {
    target: '.tour-target-sidebar-properties',
    content: $t('dashboard.tour.properties'),
    placement: 'bottom-right',
    class: 'bg-white'
  },
  {
    target: '.tour-target-sidebar-contracts',
    content: $t('dashboard.tour.contracts'),
    placement: 'bottom-right',
    class: 'bg-white'
  }
];

// Função para buscar dados da API
const fetchDashboardData = async () => {
  try {
    // Buscar estatísticas com filtro de data
    const [contractsData, propertiesData, contactsData, walletData, overviewData] = await Promise.all([
      $fetch('/api/contracts/stats', {
        query: {
          startDate: dateRange.value.startDate.toISOString(),
          endDate: dateRange.value.endDate.toISOString()
        }
      }).catch(() => ({ total: 0, new: 0 })),
      $fetch('/api/properties/stats', {
        query: {
          startDate: dateRange.value.startDate.toISOString(),
          endDate: dateRange.value.endDate.toISOString()
        }
      }).catch(() => ({ total: 0, new: 0 })),
      $fetch('/api/contacts/stats', {
        query: {
          startDate: dateRange.value.startDate.toISOString(),
          endDate: dateRange.value.endDate.toISOString()
        }
      }).catch(() => ({ total: 0, new: 0 })),
      $fetch<WalletResponse>('/api/wallet/balance', {
        query: {
          startDate: dateRange.value.startDate.toISOString(),
          endDate: dateRange.value.endDate.toISOString()
        }
      }).catch(() => ({ balance: 0, totalCredits: 0, totalDebits: 0 })),
      $fetch<OverviewResponse>('/api/dashboard/overview', {
        query: {
          startDate: dateRange.value.startDate.toISOString(),
          endDate: dateRange.value.endDate.toISOString()
        }
      }).catch(() => ({
        chart: {
          labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
          datasets: [
            {
              label: 'Contratos',
              data: [0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            },
            {
              label: 'Imóveis',
              data: [0, 0, 0, 0, 0, 0],
              backgroundColor: 'rgba(16, 185, 129, 0.5)',
              borderColor: 'rgb(16, 185, 129)',
              borderWidth: 1
            }
          ]
        },
        activities: []
      }))
    ]);

    // Atualizar as estatísticas
    stats.value = {
      totalContracts: contractsData.total || 0,
      newContracts: contractsData.new || 0,
      totalProperties: propertiesData.total || 0,
      newProperties: propertiesData.new || 0,
      totalContacts: contactsData.total || 0,
      newContacts: contactsData.new || 0,
      walletBalance: walletData.balance || 0,
      walletDiff: (walletData.totalCredits || 0) - (walletData.totalDebits || 0)
    };

    // Atualizar dados do gráfico com os valores dos cards
    chartData.value.datasets[0].data = [
      stats.value.totalContracts,
      stats.value.totalProperties,
      stats.value.totalContacts
    ];

    // Atualizar atividades recentes
    recentActivities.value = overviewData.activities || [];
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    // Definir valores padrão em caso de erro
    stats.value = {
      totalContracts: 0,
      newContracts: 0,
      totalProperties: 0,
      newProperties: 0,
      totalContacts: 0,
      newContacts: 0,
      walletBalance: 0,
      walletDiff: 0
    };
  }
};

// Watch para atualizar os dados quando o date range mudar
watch(dateRange, async () => {
  await fetchDashboardData();
}, { deep: true });

// Buscar dados iniciais
onMounted(fetchDashboardData);

const onTourComplete = () => {
  console.log('Tour da dashboard concluído!');
};
</script>

<style scoped>
.card {
  @apply transition-all duration-300;
}

.card:hover {
  @apply transform -translate-y-1;
}
</style> 