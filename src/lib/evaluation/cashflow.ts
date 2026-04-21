import type { Project } from '@/types/project';
import type { CashFlow } from '@/types/evaluation';

export function buildCashFlowSeries(project: Project): CashFlow[] {
  const totalInitial = project.initialInvestment.reduce((sum, item) => sum + (item.amount || 0), 0);
  const annualRevenue = project.demandItems.reduce(
    (sum, item) => sum + (item.unitsPerYear || 0) * (item.pricePerUnit || 0),
    0
  );
  const annualExpenses = project.recurringExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
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
    const liquidation = t === project.evaluationPeriodYears ? totalLiquidation : 0;
    const revenue = annualRevenue + liquidation;
    const net = revenue - annualExpenses;
    cumulative += net;
    cashFlows.push({
      year: t,
      revenue,
      expenses: annualExpenses,
      netCashFlow: net,
      cumulativeCashFlow: cumulative,
    });
  }

  return cashFlows;
}
