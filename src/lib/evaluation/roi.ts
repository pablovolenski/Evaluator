import type { CashFlow } from '@/types/evaluation';

export function calculateROI(cashFlows: CashFlow[]): number {
  const totalOutflows = cashFlows.reduce((sum, cf) => sum + (cf.netCashFlow < 0 ? Math.abs(cf.netCashFlow) : 0), 0);
  const totalInflows = cashFlows.reduce((sum, cf) => sum + (cf.netCashFlow > 0 ? cf.netCashFlow : 0), 0);
  if (totalOutflows === 0) return 0;
  return ((totalInflows - totalOutflows) / totalOutflows) * 100;
}
