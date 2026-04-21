import type { Project, DemandItem } from '@/types/project';
import type { CashFlow } from '@/types/evaluation';

function demandRevenue(item: DemandItem, year: number): number {
  const price = item.pricePerUnit || 0;
  if (item.unitsMode === 'monthly') {
    const monthly = item.monthlyUnits ?? [];
    return monthly.reduce((s, u) => s + (u || 0), 0) * price;
  }
  if (item.unitsMode === 'yearly') {
    const units = (item.yearlyUnits ?? [])[year - 1] ?? item.unitsPerYear ?? 0;
    return (units || 0) * price;
  }
  return (item.unitsPerYear || 0) * price;
}

export function buildCashFlowSeries(project: Project): CashFlow[] {
  const totalInitial = project.initialInvestment.reduce((sum, item) => sum + (item.amount || 0), 0);
  // Recurring expenses are stored as monthly amounts
  const annualExpenses = project.recurringExpenses.reduce((sum, item) => sum + (item.amount || 0), 0) * 12;
  const totalLiquidation = (project.liquidationItems ?? []).reduce((sum, item) => sum + (item.amount || 0), 0);

  const cashFlows: CashFlow[] = [];
  let cumulative = 0;

  // Year 0: initial investment
  const year0Net = -totalInitial;
  cumulative += year0Net;
  cashFlows.push({
    year: 0,
    revenue: 0,
    expenses: totalInitial,
    netCashFlow: year0Net,
    cumulativeCashFlow: cumulative,
  });

  // Years 1..N — liquidation added to final year
  for (let t = 1; t <= project.evaluationPeriodYears; t++) {
    const revenue = project.demandItems.reduce((sum, item) => sum + demandRevenue(item, t), 0);
    const liquidation = t === project.evaluationPeriodYears ? totalLiquidation : 0;
    const totalRevenue = revenue + liquidation;
    const net = totalRevenue - annualExpenses;
    cumulative += net;
    cashFlows.push({
      year: t,
      revenue: totalRevenue,
      expenses: annualExpenses,
      netCashFlow: net,
      cumulativeCashFlow: cumulative,
    });
  }

  return cashFlows;
}
