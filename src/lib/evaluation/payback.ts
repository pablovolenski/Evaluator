import type { CashFlow } from '@/types/evaluation';

export function calculatePayback(cashFlows: CashFlow[]): number | null {
  for (let i = 1; i < cashFlows.length; i++) {
    if (cashFlows[i].cumulativeCashFlow >= 0) {
      const prev = cashFlows[i - 1].cumulativeCashFlow;
      const curr = cashFlows[i].netCashFlow;
      if (curr <= 0) return null;
      return (i - 1) + Math.abs(prev) / curr;
    }
  }
  return null;
}
