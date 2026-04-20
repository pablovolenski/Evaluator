import type { CashFlow } from '@/types/evaluation';

export function calculateNPV(cashFlows: CashFlow[], rate: number): number {
  return cashFlows.reduce((sum, cf) => {
    return sum + cf.netCashFlow / Math.pow(1 + rate, cf.year);
  }, 0);
}
