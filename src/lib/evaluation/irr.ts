import type { CashFlow } from '@/types/evaluation';

function npvAt(cashFlows: CashFlow[], rate: number): number {
  return cashFlows.reduce((sum, cf) => sum + cf.netCashFlow / Math.pow(1 + rate, cf.year), 0);
}

function dnpvAt(cashFlows: CashFlow[], rate: number): number {
  return cashFlows.reduce(
    (sum, cf) => sum + (-cf.year * cf.netCashFlow) / Math.pow(1 + rate, cf.year + 1),
    0
  );
}

export function calculateIRR(cashFlows: CashFlow[]): number | null {
  // Need at least one sign change for a real IRR
  const hasNegative = cashFlows.some((cf) => cf.netCashFlow < 0);
  const hasPositive = cashFlows.some((cf) => cf.netCashFlow > 0);
  if (!hasNegative || !hasPositive) return null;

  let r = 0.1;
  for (let i = 0; i < 1000; i++) {
    const f = npvAt(cashFlows, r);
    const df = dnpvAt(cashFlows, r);
    if (Math.abs(df) < 1e-12) break;
    const rNew = r - f / df;
    if (Math.abs(rNew - r) < 1e-7) return rNew;
    r = rNew;
    if (r <= -1) return null;
  }
  return null;
}
