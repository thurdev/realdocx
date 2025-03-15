import { defineEventHandler, getQuery } from 'h3'
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event);

  // Check if the user is authenticated
  if (!session.secure || !session.secure.userId) {
    return {
      error: "Unauthorized",
    };
  }

  // Get date range from query
  const query = getQuery(event);
  const startDate = query.startDate ? new Date(query.startDate as string) : new Date(new Date().setDate(1));
  const endDate = query.endDate ? new Date(query.endDate as string) : new Date();

  // Buscar transações recentes
  const recentTransactions = await prisma.transactions.findMany({
    where: {
      userId: session.secure.userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 5,
    include: {
      contract: true,
    },
  });

  // Mapear transações para o formato de atividades
  const activities = recentTransactions.map(transaction => ({
    title: transaction.type === 'credit' ? 'Crédito Adicionado' : 'Crédito Usado',
    description: transaction.contract 
      ? `Contrato #${transaction.contract.id}` 
      : `€${transaction.amount.toFixed(2)}`,
    time: transaction.createdAt.toISOString(),
    color: transaction.type === 'credit' ? 'bg-green-500' : 'bg-blue-500',
    icon: transaction.type === 'credit' ? 'fa-plus' : 'fa-minus',
  }));

  // Buscar dados para o gráfico
  const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const currentMonth = new Date().getMonth();
  const labels = monthLabels.slice(currentMonth - 5, currentMonth + 1);

  // Buscar contratos por mês
  const contracts = await prisma.contracts.findMany({
    where: {
      generatedBy: session.secure.userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Buscar imóveis por mês
  const properties = await prisma.properties.findMany({
    where: {
      userId: session.secure.userId,
      createdAt: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Agrupar por mês
  const contractsByMonth = new Array(6).fill(0);
  const propertiesByMonth = new Array(6).fill(0);

  contracts.forEach(contract => {
    const month = new Date(contract.createdAt).getMonth();
    const index = labels.indexOf(monthLabels[month]);
    if (index !== -1) {
      contractsByMonth[index]++;
    }
  });

  properties.forEach(property => {
    const month = new Date(property.createdAt).getMonth();
    const index = labels.indexOf(monthLabels[month]);
    if (index !== -1) {
      propertiesByMonth[index]++;
    }
  });

  return {
    chart: {
      labels,
      datasets: [
        {
          label: 'Contratos',
          data: contractsByMonth,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        },
        {
          label: 'Imóveis',
          data: propertiesByMonth,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 1
        }
      ]
    },
    activities
  }
}) 